import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const GET_USERS = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  users: any[] = [];
  loading = true;
  error: any = null;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo.watchQuery<any>({
      query: GET_USERS
    }).valueChanges.subscribe({
      next: ({ data, loading }) => {
        this.users = data?.users ?? [];
        this.loading = loading;
      },
      error: (err) => {
        this.error = err;
        console.error('GraphQL Error:', err);
      }
    });
  }
}