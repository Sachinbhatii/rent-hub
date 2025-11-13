import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DB } from '../../core/services/db';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  posts: any[] = [];
  favorites: any[] = [];

  // Search and filter states
  searchText = '';
  showFilters = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  filters = {
    location: '',
    furnished: false,
    shared: false,
    amenities: {} as { [key: string]: boolean },
  };

  amenityList = [
    'gym', 'swimmingPool', 'carPark', 'visitorsParking', 'powerBackup',
    'garbageDisposal', 'privateLawn', 'waterHeater', 'plantSecurity',
    'laundryService', 'elevator', 'clubHouse'
  ];

  constructor(private db: DB, private router: Router) {}

  async ngOnInit() {
    await this.db.init();
    this.posts = await this.db.getAll('posts');
    this.favorites = (await this.db.getAll('favorites')) || [];
  }

  /** Toggle advanced filter dropdown */
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  /** Apply filters and update displayed posts */
  applyFilters() {
    this.showFilters = false;
  }

  /** Filtered posts based on search and filters */
  filteredPosts() {
    return this.posts.filter(post => {
      // Search filter
      const matchesSearch =
        post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.buildingName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.address.toLowerCase().includes(this.searchText.toLowerCase());

      // Location filter
      const matchesLocation =
        !this.filters.location ||
        post.address.toLowerCase().includes(this.filters.location.toLowerCase());

      // Price filter
      const matchesPrice =
        (!this.minPrice || post.expectedRent >= this.minPrice) &&
        (!this.maxPrice || post.expectedRent <= this.maxPrice);

      // Furnished filter
      const matchesFurnished = !this.filters.furnished || post.furnished === 'yes';

      // Shared filter
      const matchesShared = !this.filters.shared || post.shared === 'yes';

      // Amenities filter
      const matchesAmenities = Object.keys(this.filters.amenities).every(key => {
        return !this.filters.amenities[key] || post.amenities[key];
      });

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPrice &&
        matchesFurnished &&
        matchesShared &&
        matchesAmenities
      );
    });
  }

  /** Favorites logic */
  isFavorite(post: any): boolean {
    return this.favorites.some((f: any) => f.id === post.id);
  }

  async toggleFavorite(post: any) {
    if (this.isFavorite(post)) {
      await this.db.delete('favorites', post.id);
    } else {
      await this.db.add('favorites', post);
    }
    this.favorites = await this.db.getAll('favorites');
  }

  viewDetails(post: any) {
    this.router.navigate(['/view-details', post.id]);
  }
}