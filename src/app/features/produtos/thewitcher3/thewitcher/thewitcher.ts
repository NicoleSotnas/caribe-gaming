import { Component } from '@angular/core';
import { GalleryModule } from 'primeng/gallery';
import { ChevronLeft } from '@primeicons/angular/chevron-left';
import { ChevronRight } from '@primeicons/angular/chevron-right';

@Component({
  selector: 'app-thewitcher',
  imports: [],
  templateUrl: './thewitcher.html',
  styleUrl: './thewitcher.css',

   template: `
        <p-gallery class="h-150!">
            <p-gallery-backdrop></p-gallery-backdrop>
            <button pGalleryPrev>
                <svg data-p-icon="chevron-left"></svg>
            </button>
            <button pGalleryNext>
                <svg data-p-icon="chevron-right"></svg>
            </button>
            <p-gallery-content>
                @for (image of images; track image) {
                    <p-gallery-item>
                        <img [src]="image" alt="image" />
                    </p-gallery-item>
                }
            </p-gallery-content>
            <p-gallery-footer>
                <p-gallery-thumbnail>
                    <p-gallery-thumbnail-content>
                        @for (image of images; track image; let i = $index) {
                            <p-gallery-thumbnail-item [index]="i">
                                <img [attr.draggable]="false" [src]="image" class="h-full w-full object-cover" />
                            </p-gallery-thumbnail-item>
                        }
                    </p-gallery-thumbnail-content>
                </p-gallery-thumbnail>
            </p-gallery-footer>
        </p-gallery>
    `,
    standalone: true,
    imports: [GalleryModule, ChevronLeft, ChevronRight]
})


export class Thewitcher {

    photos: [number, number, number][] = [
        [10, 1200, 800],
        [11, 800, 1200],
        [15, 1400, 700],
        [16, 700, 1050],
        [17, 1000, 1000]
    ];
    images = this.photos.map(([id, w, h]) => `https://picsum.photos/id/${id}/${w}/${h}`);
  
}
