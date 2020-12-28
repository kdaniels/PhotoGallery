### Cross Platform Image Gallery Application using Ionic, Vue and Android Studio

This web focused application highlights the capabilities of the Ionic platform, allowing the user to capture images using their device (e.g., webcam, mobile camera), save them to the device's local storage and access them at any later instance. The code works across all platforms, with some minor alterations for the file storage and retrieval of the web application vs the native Android implementation. 

Highlights from the code include
```vue
/** Load the files from the file storage and display them in base64 */
const loadSaved = async () => {
  const photoList = await Storage.get({ key: PHOTO_STORAGE });
  const photosInStorage = photoList.value ? JSON.parse(photoList.value): [];

  if (!isPlatform('hybrid')) {
    for (const photo of photosInStorage) {
      const file = await Filesystem.readFile({
        path: photo.filepath,
        directory: FilesystemDirectory.Data
      });
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }
  }

  photos.value = photosInStorage;
}
```
