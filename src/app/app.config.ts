import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {provideHttpClient} from '@angular/common/http';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import {definePreset} from '@primeuix/themes';
import {DialogService} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
export const MyPreset = definePreset(Aura as any, {
  semantic: {
    primary: {
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}'
    }
  }
});

export const appConfig: ApplicationConfig = {

  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset
      }
    }),
    provideHttpClient(),
    DialogService,
    MessageService
  ]
};
