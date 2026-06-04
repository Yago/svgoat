import Alpine from 'alpinejs';

import { svgoat } from './components/svgoat';

import './main.css';

window.Alpine = Alpine;

Alpine.data('svgoat', svgoat);

Alpine.start();
