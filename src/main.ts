import Alpine from 'alpinejs';
import './main.css';

import svgo from './stores/svgo';

window.Alpine = Alpine;

Alpine.store('svgo', svgo);

Alpine.start();
