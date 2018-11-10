import { TestBed } from '@angular/core/testing';

import { UserSuggestionService } from './user-suggestion.service';

describe('UserSuggestionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserSuggestionService = TestBed.get(UserSuggestionService);
    expect(service).toBeTruthy();
  });
});
