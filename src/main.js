/* Set up using Vue 3 */
import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/styles.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faCheckCircle as faSolidCheckCircle, faArrowRotateLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(
  faCheckCircle,
  faCircleXmark,
  faSolidCheckCircle,
  faArrowRotateLeft,
  faPenToSquare)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')