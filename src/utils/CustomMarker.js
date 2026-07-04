import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../styles/designSystem';

/**
 * CustomMarker Component
 * 
 * A reusable custom marker component for the map that displays property information
 * with a consistent design following the app's design system.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.coordinate - Latitude and longitude coordinates
 * @param {Object} props.property - Property data object
 * @param {Function} props.onPress - Callback function when marker is pressed
 * @param {string} props.type - Type of marker ('property', 'search', 'user')
 * @param {string} props.title - Optional title for the marker
 * @param {string} props.description - Optional description for the marker
 */
const CustomMarker = ({
  coordinate,
  property,
  onPress,
  type = 'property',
  title,
  description
}) => {

  // Render different marker styles based on type
  const renderMarkerContent = () => {
    switch (type) {
      case 'search':
        return (
          <View style={[styles.markerContainer, styles.searchMarker]}>
            <Ionicons name="location" size={20} color={Colors.surface} />
          </View>
        );

      case 'user':
        return (
          <View style={[styles.markerContainer, styles.userMarker]}>
            <Ionicons name="person" size={16} color={Colors.surface} />
          </View>
        );

      case 'property':
      default:
        // For property markers: display only the price, nothing else
        return (
          property?.price != null ? (
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>
                ₹{((typeof property.price === 'number' ? property.price : 0) / 1000).toFixed(0)}K
              </Text>
            </View>
          ) : null
        );
    }
  };

  return (
    <Marker
      coordinate={coordinate}
      onPress={onPress}
      title={title}
      description={description}
      anchor={{ x: 0, y: 0 }} // Anchor point at bottom center
      centerOffset={{ x: 0, y: 0 }} // Offset to center properly
    >
      {renderMarkerContent()}
    </Marker>
  );
};

const styles = StyleSheet.create({
  // Base marker container
  markerContainer: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
    ...Shadows.medium,
  },
  // Search location marker
  searchMarker: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
  },

  // User location marker
  userMarker: {
    backgroundColor: Colors.success,
    width: 32,
    height: 32,
  },

  // Price badge above the marker
  priceBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    ...Shadows.small,
    minWidth: 20,
    alignItems: 'center',
  },

  priceText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 9,
  },
});

export default CustomMarker;