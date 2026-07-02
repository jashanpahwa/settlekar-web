# LivableIndia Developer API Integration Guide

Welcome to the LivableIndia Score Fetching API! This detailed guide describes how to programmatically query compound and sub-pillar neighborhood scores.

---

## 1. Getting Started & Authentication

To authenticate your API requests, you must pass your API key as a custom header: `x-api-key`.

| Header Name | Type | Required | Description |
|---|---|---|---|
| `x-api-key` | string | Yes | Your cryptographically secure developer API key: `li_dev_42129f81605d350a3e0f35f3021e97966cbe47fe3f0c3882` |

*Security Warning: Never expose your API key in client-side code (frontend browsers). Route requests through your backend server.*

---

## 2. API Endpoint Details

### Fetch Neighborhood Score
Retrieve detailed scores and metrics for a specific coordinate or postal address.

- **URL**: `https://us-central1-liveableindia-314ce.cloudfunctions.net/getNeighborhoodScore`
- **Method**: `GET` (or `POST`)

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `lat` | float | Yes* | Latitude of the locality (e.g., 28.6139). |
| `lng` | float | Yes* | Longitude of the locality (e.g., 77.2090). |
| `address` | string | Yes* | Real postal address to geocode. *Required if lat/lng are omitted.* |
| `mode` | string | No | Set to `sandbox` to test integrations without depleting daily quotas. |

---

## 3. Sandbox Mode

For local development and testing, always pass `mode=sandbox` in your query parameters. 
- **Benefit**: Request limits are ignored, and mock scores are returned instantly without invoking heavy database operations.
- **Example request**:
  ```bash
  curl -X GET "https://us-central1-liveableindia-314ce.cloudfunctions.net/getNeighborhoodScore?lat=28.6139&lng=77.2090&mode=sandbox" \
    -H "x-api-key: li_dev_42129f81605d350a3e0f35f3021e97966cbe47fe3f0c3882"
  ```

---

## 4. JSON Response Schema

On success (HTTP `200 OK`), the API returns the following payload structure:

```json
{
  "schema_version": "1.0",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090,
    "district": "New Delhi",
    "state": "Delhi",
    "formattedAddress": "New Delhi, India"
  },
  "overallScore": 82,
  "dataConfidence": "High",
  "pillars": {
    "water": { "score": 85, "category": "High Reliability", "description": "Good groundwater baseline." },
    "power": { "score": 80, "category": "Stable", "description": "24/7 grid connectivity." },
    "safety": { "score": 90, "category": "Safe", "description": "Very low local crime index." },
    "sanitation": { "score": 85, "category": "High Sanitation", "description": "Daily waste clearing." },
    "climate": { "score": 80, "category": "Low Risk", "description": "No flood history." },
    "healthcare": { "score": 90, "category": "Excellent", "description": "Hospitals within 1km." },
    "air": { "score": 75, "category": "Moderate", "description": "PM2.5: 32ug/m3." },
    "transit": { "score": 88, "category": "Connected", "description": "Subway access mapped." },
    "greenery": { "score": 78, "category": "Lush", "description": "Parks within walk range." },
    "grocery": { "score": 85, "category": "Abundant", "description": "Markets nearby." },
    "dining": { "score": 80, "category": "Vibrant", "description": "Restaurants mapped." }
  },
  "meta": {
    "generatedAt": "2026-07-02T14:22:19.391Z",
    "mode": "live",
    "quotaUsed": 0,
    "quotaLimit": 100
  }
}
```

---

## 5. HTTP Error Status Codes

- **`400 Bad Request`**: Invalid coordinates or missing address parameter.
- **`401 Unauthorized`**: API key is missing or invalid.
- **`403 Forbidden`**: Key is inactive or has expired.
- **`429 Too Many Requests`**: Daily quota exceeded.
- **`500 Internal Error`**: Server-side error.

---

© 2026 Settlekar (LivableIndia). All rights reserved.
