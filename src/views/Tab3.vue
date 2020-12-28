<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Information</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="ion-text-center">
        <div class="ion-padding-top">
        <h4>About the application and how to use</h4>
        <p>Cross Platform Image Gallery Application for Web and Mobile using Ionic, Vue and Android Studio</p>
        Allow access from the device, and click on any images you want to remove
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default  {
  name: 'Tab3',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>