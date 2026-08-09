import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideHttpClient, withXhr } from '@angular/common/http';

// ✅ IMPORTAR NG ICONS
import { provideIcons } from '@ng-icons/core';
import {
  heroHeart,
  heroCalendar,
  heroMapPin,
  heroArrowDown,
  heroClock,
  heroMap,
  heroSparkles,
  heroCheckBadge,
  heroBookOpen,
  heroCamera,
  heroCheck,
  heroUsers,
  heroGift,
  heroCalendarDays,
  heroHashtag,
  heroStar,
  heroShare,
  heroTag,
} from '@ng-icons/heroicons/outline';
//Lucide icons
import {
  lucideChurch,
  lucideSparkles,
  lucideArrowBigDown,
  lucideHeartCrack,
  lucideHourglass,
  lucideBan,
  lucideCrown,
  lucideCar,
  lucideCheckCheck,
  lucideClipboard,
  lucideBaby,
  lucideEye,
  lucideSmartphone,
  lucideParkingCircle,
  lucidePin,
  lucideMail,
  lucideFeather,
} from '@ng-icons/lucide';
//Huge Icons
import {
  hugeBulb,
  hugeAirbnb,
  hugeSuit02,
  hugeStar,
  hugePhoneOff01,
  hugeDiamond02,
} from '@ng-icons/huge-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStorage(() => getStorage()),
    provideHttpClient(withXhr()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),

    // ✅ AGREGAR NG ICONS
    provideIcons({
      //Heroicons
      heroHeart,
      heroCalendar,
      heroMapPin,
      heroArrowDown,
      heroClock, //
      heroMap, //
      heroSparkles, //
      heroCheckBadge,
      heroBookOpen,
      heroCamera,
      heroCheck,
      heroUsers,
      heroGift,
      heroCalendarDays,
      heroHashtag,
      heroStar,
      heroShare,
      heroTag,

      //Lucide Icons
      lucideChurch,
      lucideSparkles,
      lucideArrowBigDown,
      lucideHeartCrack,
      lucideHourglass,
      lucideBan,
      lucideCrown,
      lucideCar,
      lucideCheckCheck,
      lucideClipboard,
      lucideBaby,
      lucideEye,
      lucideSmartphone,
      lucideParkingCircle,
      lucidePin,
      lucideMail,
      lucideFeather,

      //Huge Icons
      hugeBulb,
      hugeAirbnb,
      hugeSuit02,
      hugeStar,
      hugePhoneOff01,
      hugeDiamond02,
    }),
  ],
};
