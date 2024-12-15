document.getElementById('search-btn').addEventListener('click', () => {
  const zipcode = document.getElementById('zipcode').value;

  if (!zipcode) {
    alert('郵便番号を入力してください。');
    return;
  }

  fetch(`http://zip.cgis.biz/xml/zip.php?zn=${zipcode}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('郵便番号検索APIに接続できませんでした。');
      }
      return response.text();
    })
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => {
      const state = data.querySelector('state');
      const city = data.querySelector('city');
      const address = data.querySelector('address');

      if (state && city && address) {
        const fullAddress = state.textContent + city.textContent + address.textContent;
        document.getElementById('address').textContent = fullAddress;
        showMap(fullAddress);
      } else {
        alert('有効な住所が見つかりませんでした。');
      }
    })
    .catch(error => {
      console.error('エラー:', error);
      alert('エラーが発生しました: ' + error.message);
    });
});

function showMap(address) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, (results, status) => {
    if (status === 'OK') {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: results[0].geometry.location
      });
      new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('地図を表示できませんでした: ' + status);
    }
  });
}
