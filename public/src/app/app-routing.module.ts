import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "app/dashboard/dashboard.component";
import { LeaderboardsComponent } from "app/leaderboards/leaderboards.component";
import { LoginComponent } from "app/login/login.component";
import { LogoutComponent } from "app/logout/logout.component";
import { RegisterComponent } from "app/register/register.component";
import { ResultsComponent } from "app/results/results.component";


const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'leaderboards', component: LeaderboardsComponent},
    {path: 'results', component: ResultsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }