import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LogOutComponent } from './logout/logout.component';
import { UpdateIdentityComponent } from './update-identity/update-identity.component';

/* Use this routes definition in case you want to make them lazy-loaded */
const routes: Routes = [
    { path: '', component: UpdateIdentityComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        RouterModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDividerModule,
    ],
    declarations: [
        LogOutComponent,
        UpdateIdentityComponent,
        UpdateIdentityComponent
    ],
    entryComponents: [UpdateIdentityComponent],
    exports: [
        LogOutComponent
    ]
})
export class ProfileModule { }
