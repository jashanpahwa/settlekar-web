import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../styles/designSystem';
import { propertyService, referencePropertyService } from '../services';

// Import components
import CustomMarker from '../../components/search-page/CustomMarker';
import FilterBar from '../../components/search-page/FilterBar';
import FloatingActions from '../../components/search-page/FloatingActions';
import PreSearchSurvey from '../../components/search-page/PreSearchSurvey';
import PropertiesBottomSheet from '../../components/search-page/PropertiesBottomSheet';
import PropertyCardOverlay from '../../components/search-page/PropertyCardOverlay'; // Add this import
import { SearchOverlay } from '../../components/search-page/SearchOverlay';

// Import utilities
import {
  cleanupMapManager,
  FilterManager,
  LocationManager,
  MapManager,
  SearchManager
} from '../../components/search-page/searchUtils';

// Import hooks
import useSearchPageSurvey from '../../hooks/useSearchPageSurvey';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getFastUserLocation = async () => {
  try {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Strategy 1: Try cached location first (INSTANT)
    try {
      const lastKnown = await Location.getLastKnownPositionAsync({
        maxAge: 300000, // Accept location up to 5 minutes old
      });

      if (lastKnown) {
        return {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
      }
    } catch (cacheError) {
      // Ignore cache errors
    }

    // Strategy 2: Fast network-based location (1-2 seconds)
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 60000,
      timeout: 3000,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

  } catch (error) {
    console.error('❌ Fast location fetch failed:', error);
    throw error;
  }
};

export default function SearchPage() {
  // Survey hook
  const {
    surveyVisible,
    surveyCompleted,
    isSurveyLoading,
    handleSurveyComplete,
    handleSurveySkip,
    getUserPreferences,
    hasPreferences,
    shouldShowContent,
    loadExistingSurveyData,
    surveyData
  } = useSearchPageSurvey();

  // Core application state
  const [appState, setAppState] = useState({
    // Location data
    userLocation: null,
    searchLocation: null,

    // Property data
    allProperties: [],
    filteredProperties: [],

    // UI state
    isLoading: false,
    searchQuery: '',
    showSearchOverlay: false,

    // Filter state
    filters: FilterManager.getDefaultFilters(),

    // Error state
    error: null,

    // Map state
    markersReady: true,

    // Property Card Overlay state
    selectedProperty: null,
    showPropertyOverlay: false,
  });

  // Refs
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const propertiesUnsubscribeRef = useRef(null);
  const overlayAnimatedValue = useRef(new Animated.Value(0)).current;

  // Bottom sheet snap points
  const snapPoints = useMemo(() => {
    return ['20%', '50%', '70%'];
  }, []);

  /**
   * Update app state helper
   */
  const updateAppState = useCallback((updates) => {
    if (!updates || typeof updates !== 'object') {
      console.error('❌ Invalid updates passed to updateAppState:', updates);
      return;
    }
    setAppState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Initialize the application
   */
  const initializeApp = useCallback(async () => {

    try {
      updateAppState({ isLoading: true, error: null });

      // Start loading both properties and reference properties in parallel
      const propertiesPromise = new Promise((resolve, reject) => {
        const unsubscribe = propertyService.getPropertiesRealtime(
          (properties) => {
            resolve({ properties: properties || [], unsubscribe, type: 'regular' });
          },
          (error) => {
            console.error('Properties listener error:', error);
            reject(error);
          }
        );
      });

      const referencePropertiesPromise = new Promise((resolve, reject) => {
        const unsubscribe = referencePropertyService.getReferencePropertiesRealtime(
          (referenceProperties) => {
            resolve({ properties: referenceProperties || [], unsubscribe, type: 'reference' });
          },
          (error) => {
            console.error('Reference properties listener error:', error);
            reject(error);
          }
        );
      });

      // Get user location using FAST method
      const locationPromise = getFastUserLocation();

      // Wait for all to complete
      const [propertiesResult, referencePropertiesResult, userLocation] = await Promise.all([
        propertiesPromise,
        referencePropertiesPromise,
        locationPromise
      ]);


      // Store both unsubscribe functions
      propertiesUnsubscribeRef.current = {
        regular: propertiesResult.unsubscribe,
        reference: referencePropertiesResult.unsubscribe
      };

      // Combine both property types with safety checks
      const allProperties = [
        ...(propertiesResult.properties || []),
        ...((referencePropertiesResult.properties || []).map(refProp => ({
          ...refProp,
          isReferenceProperty: true // Add flag to identify reference properties
        })))
      ];

      // Get nearby properties with safety checks (now uses route distance by default)
      const nearbyProperties = await SearchManager.getPropertiesNearLocation(
        allProperties,
        userLocation,
        appState.filters.kmRange
      );

      // Apply filters and sorting with safety checks
      const filteredProperties = FilterManager.sortProperties(
        FilterManager.applyFilters(nearbyProperties || [], appState.filters),
        appState.filters.sortBy
      );

      // Update state
      updateAppState({
        userLocation,
        allProperties: allProperties,
        filteredProperties: filteredProperties || [],
        isLoading: false,
        error: null
      });

      // Animate map to user location using MapManager
      setTimeout(async () => {
        try {
          const result = await MapManager.animateMapToContent(
            mapRef,
            filteredProperties,
            null,
            userLocation
          );
        } catch (animationError) {
          console.error('❌ Map animation failed:', animationError);
        }
      }, 50);


    } catch (error) {
      console.error('❌ App initialization failed:', error);
      console.error('❌ Error stack:', error.stack);
      updateAppState({
        isLoading: false,
        error: error.message || 'Failed to initialize app'
      });
    }
  }, [appState.filters.kmRange, appState.filters.sortBy]);

  /**
   * Perform search operation
   */
  const performSearch = useCallback(async (query) => {

    try {
      handleClosePropertyOverlay();

      updateAppState({ isLoading: true, error: null });

      let searchLocation = null;
      let searchResults = [];

      if (query === 'current_location') {
        // Use current location
        searchLocation = appState.userLocation;
        if (!searchLocation) {
          throw new Error('Current location not available');
        }
      } else if (query && query.trim()) {
        // Geocode the search query
        searchLocation = await SearchManager.geocodeLocation(query);
        updateAppState({ searchQuery: query });
      }

      if (searchLocation) {
        // Get properties near search location (now uses route distance by default)
        searchResults = await SearchManager.getPropertiesNearLocation(
          appState.allProperties,
          searchLocation,
          appState.filters.kmRange
        );
      } else {
        // Text-based search
        searchResults = SearchManager.searchPropertiesByText(
          appState.allProperties,
          query
        );

        // Enrich with distance info if we have user location
        if (appState.userLocation && searchResults.length > 0) {
          searchResults = await SearchManager.enrichPropertiesWithRouteDistance(
            searchResults,
            appState.userLocation,
            'driving'
          );
        }
      }


      // Apply filters and sorting
      const filteredResults = FilterManager.sortProperties(
        FilterManager.applyFilters(searchResults || [], appState.filters),
        appState.filters.sortBy
      );


      // Update state
      updateAppState({
        searchLocation,
        filteredProperties: filteredResults || [],
        isLoading: false
      });

      // Animate map using MapManager
      setTimeout(async () => {
        try {
          const result = await MapManager.animateMapToContent(
            mapRef,
            filteredResults,
            searchLocation,
            appState.userLocation
          );
        } catch (animationError) {
          console.error('❌ Search map animation failed:', animationError);
        }
      }, 30);

      // Show results in bottom sheet
      if (bottomSheetRef.current) {
        bottomSheetRef.current.snapToIndex(0);
      }


    } catch (error) {
      console.error('❌ Search failed:', error);
      console.error('❌ Search error stack:', error.stack);
      updateAppState({
        isLoading: false,
        error: error.message || 'Search failed'
      });

      Alert.alert('Search Error', error.message || 'Failed to search. Please try again.');
    }
  }, [appState.userLocation, appState.allProperties, appState.filters]);

  /**
   * Update filters and re-filter properties
   */
  const updateFilters = useCallback(async (newFilters) => {

    try {
      // Handle both direct filter objects and updater functions
      const updatedFilters = typeof newFilters === 'function'
        ? newFilters(appState.filters)
        : { ...appState.filters, ...newFilters };

      handleClosePropertyOverlay();
      // Determine base properties to filter
      let baseProperties = appState.allProperties;

      if (appState.searchLocation) {
        // Filter by search location (now uses route distance by default)
        baseProperties = await SearchManager.getPropertiesNearLocation(
          appState.allProperties,
          appState.searchLocation,
          updatedFilters.kmRange
        );
      } else if (appState.userLocation) {
        // Filter by user location (now uses route distance by default)
        baseProperties = await SearchManager.getPropertiesNearLocation(
          appState.allProperties,
          appState.userLocation,
          updatedFilters.kmRange
        );
      }


      // Apply filters and sorting
      const filteredProperties = FilterManager.sortProperties(
        FilterManager.applyFilters(baseProperties || [], updatedFilters),
        updatedFilters.sortBy
      );


      updateAppState({
        filters: updatedFilters,
        filteredProperties: filteredProperties || []
      });

      // Animate map to show filtered results using MapManager
      setTimeout(async () => {
        try {
          const result = await MapManager.animateMapToContent(
            mapRef,
            filteredProperties,
            appState.searchLocation,
            appState.userLocation
          );
        } catch (animationError) {
          console.error('❌ Filter map animation failed:', animationError);
        }
      }, 150);
    } catch (filterError) {
      console.error('❌ Filter update failed:', filterError);
      console.error('❌ Filter error stack:', filterError.stack);
    }

  }, [appState.filters, appState.allProperties, appState.searchLocation, appState.userLocation]);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    try {
      const defaultFilters = FilterManager.getDefaultFilters();
      updateFilters(defaultFilters);
    } catch (resetError) {
      console.error('❌ Reset filters failed:', resetError);
    }
  }, [updateFilters]);

  /**
   * Handle map press (tap to search location)
   */
  const handleMapPress = useCallback(async (event) => {
    try {
      handleClosePropertyOverlay();

      const { coordinate } = event.nativeEvent;

      // Get properties near tapped location (now uses route distance by default)
      const nearbyProperties = await SearchManager.getPropertiesNearLocation(
        appState.allProperties,
        coordinate,
        appState.filters.kmRange
      );


      // Apply filters and sorting
      const filteredProperties = FilterManager.sortProperties(
        FilterManager.applyFilters(nearbyProperties || [], appState.filters),
        appState.filters.sortBy
      );


      updateAppState({
        searchLocation: coordinate,
        filteredProperties: filteredProperties || [],
        searchQuery: '' // Clear text search
      });

      // Animate map to tapped location using MapManager
      setTimeout(async () => {
        try {
          const result = await MapManager.animateMapToContent(
            mapRef,
            filteredProperties,
            coordinate,
            appState.userLocation
          );
        } catch (animationError) {
          console.error('❌ Map tap animation failed:', animationError);
        }
      }, 20);
    } catch (mapPressError) {
      console.error('❌ Map press handling failed:', mapPressError);
    }
  }, [appState.allProperties, appState.filters]);

  /**
 * Handle property marker press - show PropertyCardOverlay
 */
  const handlePropertyMarkerPress = useCallback((property) => {
    try {
      // Close the bottom sheet by snapping to the lowest position
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close(); // Minimize the bottom sheet
      }

      // Small delay to ensure bottom sheet is closed before showing overlay
      setTimeout(() => {
        // Set the selected property and show overlay
        updateAppState({
          selectedProperty: property,
          showPropertyOverlay: true
        });

        // Animate the overlay in
        Animated.spring(overlayAnimatedValue, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }, 50);

    } catch (markerError) {
      console.error('❌ Marker press handling failed:', markerError);
    }
  }, [overlayAnimatedValue, updateAppState]);


  /**
   * Handle closing the PropertyCardOverlay
   */
  const handleClosePropertyOverlay = useCallback(() => {
    // Animate the overlay out
    Animated.spring(overlayAnimatedValue, {
      toValue: 0,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      // Hide overlay after animation completes
      updateAppState({
        showPropertyOverlay: false,
        selectedProperty: null
      });
    });

    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0); // This will minimize the bottom sheet
    }
  }, [overlayAnimatedValue, updateAppState]);


  /**
   * Load saved filters on mount
   */
  useEffect(() => {
    const loadSavedFilters = async () => {
      try {
        const savedFilters = await AsyncStorage.getItem('searchFilters');
        if (savedFilters) {
          const filters = JSON.parse(savedFilters);
          updateAppState({ filters });
        }
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    };

    loadSavedFilters();
  }, []);

  /**
   * Save filters when they change
   */
  useEffect(() => {
    const saveFilters = async () => {
      try {
        await AsyncStorage.setItem('searchFilters', JSON.stringify(appState.filters));
      } catch (error) {
        console.error('Error saving filters:', error);
      }
    };

    saveFilters();
  }, [appState.filters]);

  useEffect(() => {
    // Load existing survey data on mount
    loadExistingSurveyData();
  }, [loadExistingSurveyData]);

  /**
   * Initialize app only after survey is completed
   */

  useEffect(() => {
    const shouldShow = shouldShowContent();

    if (shouldShow) {
      initializeApp();
    }

    // Cleanup on unmount
    return () => {
      let cleanupError = null;

      try {
        if (propertiesUnsubscribeRef.current) {
          if (propertiesUnsubscribeRef.current.regular && typeof propertiesUnsubscribeRef.current.regular === 'function') {
            propertiesUnsubscribeRef.current.regular();
          }
          if (propertiesUnsubscribeRef.current.reference && typeof propertiesUnsubscribeRef.current.reference === 'function') {
            propertiesUnsubscribeRef.current.reference();
          }
          // Clear the ref to prevent double cleanup
          propertiesUnsubscribeRef.current = null;
        }
      } catch (error) {
        cleanupError = error;
        console.error('❌ Cleanup error in property unsubscription:', error);
      }

      try {
        cleanupMapManager();
      } catch (error) {
        cleanupError = error;
        console.error('❌ Cleanup error in map manager:', error);
      }

      if (cleanupError) {
        console.error('❌ Overall cleanup completed with errors');
      } else {
      }
    };
  }, [shouldShowContent]);


  if (surveyVisible && !isSurveyLoading && isSurveyLoading !== null) {
    return (
      <SafeAreaView style={styles.container}>
        <PreSearchSurvey
          visible={surveyVisible}
          onComplete={handleSurveyComplete}
          onSkip={handleSurveySkip}
          existingSurveyData={surveyData}
        />
      </SafeAreaView>
    );
  }

  // Show loading screen during initialization
  else if (appState.isLoading && !appState.userLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Ionicons name="location-outline" size={64} color={Colors.primary} />
            <Text style={styles.loadingTitle}>Finding your location...</Text>
            <Text style={styles.loadingSubtitle}>
              We're setting up the perfect search experience for you
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Show error screen if initialization failed
  else if (appState.error && !appState.userLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
            <Text style={styles.errorTitle}>Unable to load</Text>
            <Text style={styles.errorSubtitle}>{appState.error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={initializeApp}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.container}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onPress={handleMapPress}
        initialRegion={
          appState.userLocation ? {
            ...appState.userLocation,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          } : undefined
        }
      >
        {/* Search location marker */}
        {appState.searchLocation && (
          <CustomMarker
            coordinate={appState.searchLocation}
            type="search"
            title="Search Location"
            description="Properties near this location"
          />
        )}

        {/* Property markers */}
        {appState.filteredProperties.map(property => {
          const coords = LocationManager.extractCoordsFromLink(property.location);
          return (
            <CustomMarker
              key={property.id}
              coordinate={coords}
              property={property}
              type="property"
              onPress={() => handlePropertyMarkerPress(property)}
            />
          );
        })}
      </MapView>

      {/* Overlay Container */}
      <View style={styles.overlayContainer}>
        {/* Search section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              accessible={true}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchInputContainer}
              onPress={() => {
                updateAppState({ showSearchOverlay: true });
              }}
              accessible={true}
              accessibilityLabel="Search location"
            >
              <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
              <Text style={[styles.searchInputText, !appState.searchQuery && styles.placeholderText]}>
                {appState.searchQuery || "Where do you want to live?"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Bar */}
        <FilterBar
          filters={appState.filters}
          setFilters={updateFilters}
          resetFilters={resetFilters}
        />

        {/* Floating Actions */}
        <FloatingActions
          handleSearch={performSearch}
        />
      </View>

      {/* Bottom Sheet */}
      <PropertiesBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        loadingStates={{ searching: appState.isLoading }}
        filteredProperties={appState.filteredProperties}
        emptyStateType="search"
      />

      {/* Search Overlay */}
      <SearchOverlay
        visible={appState.showSearchOverlay}
        onClose={() => {
          updateAppState({ showSearchOverlay: false });
        }}
        searchLocation={appState.searchQuery}
        setSearchLocation={() => { }}
        onSearch={(query) => {
          performSearch(query);
          updateAppState({ searchQuery: query, showSearchOverlay: false });
        }}
      />

      {/* Property Card Overlay */}
      <PropertyCardOverlay
        property={appState.selectedProperty}
        visible={appState.showPropertyOverlay}
        onClose={handleClosePropertyOverlay}
        animatedValue={overlayAnimatedValue}
      />
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  // ... rest of your styles remain the same
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  searchSection: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    pointerEvents: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    ...Shadows.small,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInputText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: Colors.textTertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  loadingContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  loadingTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  loadingSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  errorTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  errorSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadows.medium,
  },
  retryButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '700',
  },

});