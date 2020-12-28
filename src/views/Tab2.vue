<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-grid>
        <ion-row>
          <ion-col size="6" :key="photo" v-for="photo in photos">
            <ion-img :src="photo.webviewPath" @click="showActionSheet(photo)"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- <ion-fab> markup -->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { actionSheetController, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
  IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/vue';
import { camera, trash, close } from 'ionicons/icons';
import { usePhotoGallery, Photo } from '@/composables/usePhotoGallery';

export default  {
  name: 'Tab2',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonFab, IonFabButton,
    IonGrid, IonRow, IonCol, IonImg},
  setup() {
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();

    /** Prompt to delete images */
    const showActionSheet = async (photo: Photo) => {
      const actionSheet = await actionSheetController.create({
        header: 'Photos',
        buttons: [{
          text: 'Delete',
          role: 'Destructive',
          icon: trash,
          handler: () => {
            deletePhoto(photo);
        }}, {
          text: 'Cancel',
          icon: close,
          role: 'cancel',
          handler: () => {
            // nothing to do here
          }
        }]
      });
      await actionSheet.present();
    }

    return {
      photos,
      takePhoto,
      showActionSheet,
      camera, trash, close
    }
  }  
}
</script>