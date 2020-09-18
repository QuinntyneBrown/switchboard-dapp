import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { LogOutComponent } from './profile/logout/logout.component';



export const routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
            { path: 'enrolment', loadChildren: './enrolment/enrolment.module#EnrolmentModule' }
        ]
    },
    {
        path: 'welcome',
        children: [
            { path: '', loadChildren: './welcome/welcome.module#WelcomeModule' }
        ]
    },
    {
        path: 'init',
        children: [
            { path: '', loadChildren: './init-data/init-data.module#InitDataModule' }
        ]
    },
    {
        path: 'registration',
        children: [
            { path: '', loadChildren: './registration/registration.module#RegistrationModule' }
        ]
    },

    { path: 'logout', component: LogOutComponent},

    // Not found
    { path: '**', redirectTo: 'dashboard' }

];
