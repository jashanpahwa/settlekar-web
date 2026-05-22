import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PropertyRedirect() {
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const deepLink =
      `settlekar://property/detail-property?id=${id}`;

    // Try opening app
    window.location.href = deepLink;

    // Fallback to Play Store if app not installed
    setTimeout(() => {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.settlekar.settlekar';
    });
  }, [id]);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif'
      }}
    >
      Opening SettleKar...
    </div>
  );
}

export default PropertyRedirect;