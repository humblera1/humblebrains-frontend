<div align="center">
    <img src="https://humblebrains.ru/favicon.png" alt="HumbleBrains Logo" style="width:75px; height: 75px" />
    <h1>HumbleBrains</h1>
</div>

## Overview

HumbleBrains is an online brain trainer designed to enhance cognitive abilities such as memory, attention, and logical reasoning. This project represents the client-side application built using [Nuxt 3](https://v3.nuxtjs.org), providing users with various exercises to stimulate and challenge their minds.

## Features

- **Cognitive Exercises:** A diverse range of exercises targeting memory, attention, logic, and more ().
- **Progress Tracking:** Regular checkpoints to monitor and assess cognitive performance.
- **Adaptive Programs:** Based on checkpoint results, tailor-made programs featuring prioritized exercises are created to help users improve specific cognitive skills.
- **Modern UI:** A responsive and intuitive interface built with Nuxt 3 ensuring a great user experience across devices.

## Project Structure

The project is organized as follows:

```
humblebrains-frontend/
├── widgets/                    # Reusable UI components
├── pages/                      # Nuxt page components
├── public/                     # Public assets
├── assets/                     # Project-level assets (styles, images, etc.)
├── shared/                     # Shared resources across the project
│   ├── icons/                  # Icons used in the project
│   └── ui/                     # Reusable UI components (buttons, inputs, pickers, etc.)
├── docker/                     # Dir with docker images & nginx configuration
├── docker-compose.dev.yml      # File for development environment setup
├── docker-compose.prod.yml     # File for production environment setup
├── nuxt.config.ts              # Nuxt configuration file
└── README.md                   # This file
```

## Development Environment Setup

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Clone the Repository
```bash
git clone https://github.com/humblera1/humblebrains-frontend.git
```

### Start Docker Containers
Build and start the development containers using the development Docker Compose file:

```bash
docker compose -f docker-compose.dev.yml up --d
```

## Production Environment Setup
Build and start the production containers using the production Docker Compose file:

```bash
docker compose -f docker-compose.prod.yml up --d
```

## Deployment with GitHub Actions
This project utilizes GitHub Actions to automate the CI/CD process. The deployment workflow is triggered by pushing a tag that follows the pattern `v*.*.*`. The pipeline performs the following steps:

1. **Build and Push Production Image:**
    - Checks out the code.
    - Copies the `.env` file if it doesn't exist.
    - Sets up Docker Buildx.
    - Logs into Docker Hub using the provided secrets.
    - Builds and pushes the production Docker image using Docker Compose.

2. **Deploy to Production Server:**
    - Checks out the code again.
    - Copies necessary files (e.g., `docker-compose.prod.yml` and Docker-related configuration) to the production server using SCP.
    - Connects to the server via SSH, logs into Docker, pulls the latest image, and restarts the services using Docker Compose.

### Required GitHub Secrets

Before using the GitHub Actions pipeline, ensure that you add the following secrets to your repository:

- **DOCKER_USERNAME:** Your Docker Hub username.
- **DOCKER_PASSWORD:** Your Docker Hub password.
- **APP_NAME:** The name of application.
- **API_URL:** The API endpoint URL.
- **TIMEWEB_HOST:** The hostname or IP address of production server.
- **TIMEWEB_USER:** The username for SSH access to production server.
- **SSH_PRIVATE_KEY:** The SSH private key for secure access to production server.

## Extra

### Modal Window

In the project, a custom solution for managing modal windows `nuxt-humble-modal` is used. A simple example of using the package:

```vue
<template>
   <button @click="openModal(ExampleModal)">Open Modal</button>
</template>

<script>
import ExampleModal from '~/components/ExampleModal.vue';

const { openModal, closeModal, toggleModal, isSpecificWindowOpen, isOpen } = useHumbleModal();
</script>
```

You can pass properties and event listeners through the second parameter of the setter:

```js
openModal(ExampleModal, { myProperty: 'some value', onMyEvent: someHandler})
```

### Cropper

The project uses a custom solution for cropping uploaded images (user avatar upload). Example usage:

```vue
<template>
   <UiCropper v-if="uploader.image" ref="cropper" :image="uploader.image" return-as="File" lazy-evaluation />

   <button @click="handleSave">
      save file!
   </button>

   <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onFileChange" />
</template>

<script>
import { CropperExposedMethods } from '~/shared/ui/cropper/cropper.types';

// Your uploader realization
const uploader = useUploader();

const fileInput = ref<HTMLInputElement | null>(null);
const cropper = ref<null | CropperExposedMethods>(null);

function onFileChange(event) {
   uploader.uploadImage((event.target).files?.[0]);
}

const handleSaving = async () => {
   const file = await cropper.value.getFile();
   
   // upload file  
};
</script>
```

**API:**

```typescript
interface CropperProps {
    image: string | File | Blob;
    saveOriginalResolution?: boolean;

    /**
     * When working with very large images or limited memory environments, you can optimize resource usage by setting this option to true.
     *
     * You can defer the creation of Blob, File, or Base64 data
     * until you actually need it, reducing unnecessary processing and memory usage.
     *
     * Now you need to use one of methods getBlob(), getFile(), or getBase64() to generate the desired output.
     */
    lazyEvaluation?: boolean;

    /**
     * When lazyEvaluation is set to false, the image will be returned as a Blob, File, or Base64 data immediately with @cropped event.
     */
    returnAs?: 'File' | 'Blob' | 'Base64';
}
```

### API Calls
A custom plugin (`/plugins/api.ts`) is used for API requests. Example usage:

```vue
<script>
const { $api } = useNuxtApp();

const { status, data } = await useLazyAsyncData('endpoint', async () => {
   const response = await $api(`/v1/endpoint`, {
      credentials: 'include',
   });

   return response.data;
});

const isPending = computed(() => status.value === 'pending');
const isSuccess = computed(() => status.value === 'success');
</script>
```


