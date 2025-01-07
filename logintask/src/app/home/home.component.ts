
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userData: { fname: string, lname: string, email: string ,image:string} | null = null;
  users: Array<{ Id: number; fname: string; lname: string; email: string }> = [];
  currentUserId: number | null = null;
  currentUserRole: string | null = null;

  isAdmin: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit(): void {

    const token = localStorage.getItem('token');
    //const userType = localStorage.getItem('userType');
    const userUrl = `${environment.apiBaseUrl}/api/user`;
    const usersUrl = `${environment.apiBaseUrl}/api/users`;


    if (token) {

      this.http.get<{ success: boolean; userData: { fname: string; lname: string; email: string ,type:string,image:string} }>(
        userUrl,
        //{headers: { Authorization: `Bearer ${token}` },}
      ).subscribe({
        next: (response) => {
          if (response.success) {
            console.log(response);
            this.userData = response.userData;
            this.currentUserRole = response.userData.type;  // Save the user role (admin/user)
            this.isAdmin = this.currentUserRole === 'Admin';  // Set admin flag
            console.log(this.userData);
          } else {
            alert('Failed to fetch user data');
          }
        },
        error: (err) => {
          console.error('Error fetching user data', err);
        }
      });
    }
    //fetching all the users from the database
    if (token) {
      this.http
        .get<any>(
          usersUrl,
         // {headers: { Authorization: `Bearer ${token}` },}
        )
        .subscribe({
          next: (response) => {
            if (response.success) {
              //console.log(response.users);
              this.users = response.users;

              this.currentUserId = JSON.parse(atob(token.split('.')[1])).id;

              console.log(this.currentUserId);
/*
              // Sort the users to put the logged-in user at the top
          this.users = response.users.sort((a, b) => {
            if (a.Id === this.currentUserId) return -1; // Logged-in user goes to the top
            if (b.Id === this.currentUserId) return 1;
            return 0; // Keep other users' order
          });*/
            }
          },
          error: (err) => {
            console.error('Error fetching users:', err);
          },
        });
    }
  
  }
/*
  onEditUser(){
    this.router.navigate(['/edit-user']);
  }*/
 
 editUser(user: { Id: number; fname: string; lname: string; email: string }): void {
    this.router.navigate(['/edit-user'], { queryParams : { ...user } });

    //{state: { user }
  }

  deleteUser(userId: number): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http
      .delete<{ success: boolean }>(`http://localhost:3000/api/user/${userId}`
      // , { headers: { Authorization: `Bearer ${token}` },}
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.users = this.users.filter((user) => user.Id !== userId);
          } else {
            alert('Failed to delete user');
          }
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        },
      });
  }

  logout() {
    // Clear any authentication token or session data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    // Navigate to the login page after logging out
    this.router.navigate(['/login']);
  }

  // Method to download table as Excel
  downloadTableAsExcel(): void {
    const worksheetData = this.users.map(user => ({
      Id: user.Id,
      'First Name': user.fname,
      'Last Name': user.lname,
      Email: user.email,
    }));

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Export to Excel
    XLSX.writeFile(workbook, 'UserList.xlsx');
  }
   
/*
  editUser(user: { id: number; fname: string; lname: string; email: string }): void {
    const updatedDetails = { ...user }; // Replace this with the actual updated details
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.put<{ success: boolean }>('http://localhost:3000/api/user', updatedDetails, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: (response) => {
        if (response.success) {
          alert('User details updated successfully');
        } else {
          alert('Failed to update user details');
        }
      },
      error: (err) => {
        console.error('Error updating user details:', err);
      }
    });
  }*/

}
  //by using localstorage we can store the data in the browser
  //const storedUserData = localStorage.getItem('userData');
   //if (storedUserData) {
    //this.userData = JSON.parse(storedUserData);
    //console.log(this.userData);
    
   //}
