import { ref, onMounted, watch } from 'vue';
import { isPlatform } from '@ionic/vue';
import { Plugins, CameraResultType, CameraSource, CameraPhoto, 
Capacitor, FilesystemDirectory } from "@capacitor/core";

export function usePhotoGallery() {
    const { Camera, Filesystem, Storage } = Plugins;
    const photos = ref<Photo[]>([]);
    const PHOTO_STORAGE = "photos";
  
    /** Save the Photos array as JSON to file storage */
    const cachePhotos = () => {
      Storage.set({
        key: PHOTO_STORAGE,
        value: JSON.stringify(photos.value)
      });
    }

    /** Convert content to base64 data to save */
    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

    /** Save the image file from blob to base64 and back */
    const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
      let base64Data: string;

      // check which code base the application is running on
      if (isPlatform('hybrid')) {
        const file = await Filesystem.readFile({
          path: photo.path!
        });
        base64Data = file.data;
      } else {
        // fetch the photo, read as blob, then convert to base64 using our code
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        base64Data = "abc";
        base64Data = await convertBlobToBase64(blob) as string;
      }

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: FilesystemDirectory.Data
      });

      // check again which platform is accessed
      if (isPlatform('hybrid')) {
        // display the new image by rewriting the path to HTTP
        return {
          filepath: savedFile.uri,
          webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
      } else {
        // using webPath to display the new image instead of base64
        return {
          filepath: fileName,
          webviewPath: photo.webPath
        };
      }
    };

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

    const takePhoto = async () => {
      // call the image capture and record the returned Uri
      const cameraPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      /** Assign name of the image file to save */
      const fileName = new Date().getTime() + '.jpeg';
      const savedFileImage = await savePicture(cameraPhoto, fileName);

      // store the image file in the image array
      photos.value = [savedFileImage, ...photos.value];
    };
  
    /** Ask the system to check for any changes to the image cache */
    watch(photos, cachePhotos);

    /** Load the files */
    onMounted(loadSaved);

    return {
      photos,
      takePhoto
    };
  }

  export interface Photo {
    filepath: string;
    webviewPath?: string;
  }