import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataModel } from '../../datamodel/data-model.model';
import { CrudService } from '../../services/crud.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ContainerToasterService } from 'src/app/services/container-toaster.service';
@Component({
  selector: 'app-upsert-app',
  templateUrl: './upsert-app.component.html',
  styleUrls: ['./upsert-app.component.css']
})
export class UpsertAppComponent implements OnInit {
  // upsertAppForm = new FormGroup({
  //   name: new FormControl(),
  //   namespace: new FormControl(),
  //   isActive: new FormControl(),
  //   description: new FormControl(),
  //   iconLink: new FormControl(),
  //   label: new FormControl(),
  //   template: new FormControl()
  // });
  upsertAppForm: FormGroup;

  color = '9c332c';
  isLoading = true;

  createAction = true;
  projectid: any = '';
  constructor(
    private router: Router,
    private CrudServices: CrudService,
    private route: ActivatedRoute,
    private containerToaster: ContainerToasterService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.projectid = this.route.snapshot.paramMap.get('id');
    if (!this.projectid) {
      this.createAction = true;
      this.upsertAppForm = this.fb.group({
        name: ['', [
          Validators.required
        ]],
        microApps: this.fb.array([this.createDataControl(1)]),
        preloadURLS: this.fb.array([this.createPreloadControl(1)]),
        namespace: ['', [
          Validators.required
        ]],
        iconLink: ['', [
          Validators.required
        ]],
        isActive: [true, [
          Validators.required
        ]],
        description: ['', [
          Validators.required
        ]],
        label: ['', [
          Validators.required
        ]],
        rank: [1, [
          Validators.required
        ]],
        template: [''],
        _id: [''],
      });
      this.isLoading = false;
    } else {
      this.createAction = false;
      this.createEditObj();
    }
  }

  createEditObj() {
    this.CrudServices.getEditMicroApp(this.projectid).subscribe((res: any) => {
      this.upsertAppForm = this.fb.group({
        name: [res.post.mainApp.name, [
          Validators.required
        ]],
        microApps: res.post.microApps && res.post.microApps.length ?
          this.setMicroApps(res.post.microApps) : this.fb.array([this.createDataControl(1)]),
        preloadURLS: res.post.mainApp.preloadURLS && res.post.mainApp.preloadURLS.length ?
          this.setPreloadUrls(res.post.mainApp.preloadURLS) : this.fb.array([this.createDataControl(1)]),
        namespace: [res.post.mainApp.namespace, [
          Validators.required
        ]],
        iconLink: [res.post.mainApp.iconLink, [
          Validators.required
        ]],
        isActive: [res.post.mainApp.isActive, [
          Validators.required
        ]],
        description: [res.post.mainApp.description, [
          Validators.required
        ]],
        label: [res.post.mainApp.label, [
          Validators.required
        ]],
        template: [res.post.mainApp.template],
        _id: [res.post.mainApp._id],
        rank: [res.post.mainApp.rank, [
          Validators.required
        ]],
      });
      this.isLoading = false;
    }, err => {
      this.containerToaster.showError(err.message);
      this.isLoading = false;
    });
  }
  setMicroApps(microApps) {
    const appList = [];
    microApps.forEach(element => {
      appList.push(this.setDataControl(element));
    });

    return this.fb.array(appList);
  }
  setPreloadUrls(urls) {
    const appList = [];
    urls.forEach(element => {
      appList.push(this.setPreloadControl(element));
    });

    return this.fb.array(appList);
  }
  cancelApp() {
    this.router.navigate(['/']);
  }
  addNewApp() {
    if (!this.upsertAppForm.valid) {
      this.containerToaster.showWarning('Warning: Enter all fields');
    } else {
      let landingPage = false;
      if (this.upsertAppForm.value.microApps && this.upsertAppForm.value.microApps.length) {
        const groupLandingPages = [];
        this.upsertAppForm.value.microApps.forEach(element => {
          if (element.isLandingPage && !element.isGroup) {
            landingPage = true;
          } else if (element.isLandingPage && element.isGroup) {
            groupLandingPages[element.groupName] = true;
          } else if (!element.isLandingPage && element.isGroup) {
            groupLandingPages[element.groupName] = groupLandingPages[element.groupName] || false;
          }
        });
        let allowSave = true;
        Object.keys(groupLandingPages).forEach((inrApps) => {
          if (!groupLandingPages[inrApps]) {
            allowSave = false;
            this.containerToaster.showWarning('Warning: Please set landingpage/homepage/dashboard for ' + inrApps);
          }
        });
        if (allowSave) {
          if (!landingPage) {
            this.containerToaster.showWarning('Warning: Please set landingpage/homepage/dashboard');
          } else if (this.createAction === true) {
            this.createConfiguration();
          } else {
            this.updateApp();
          }
        }
      }
    }
  }
  updateApp() {
    if (this.upsertAppForm.value.preloadURLS && this.upsertAppForm.value.preloadURLS.length) {
      this.upsertAppForm.value.preloadURLS.forEach(element => {
        element.topic = this.upsertAppForm.value.namespace + '-' + element.name;
      });
    }
    this.CrudServices.updateConfigurationData(this.upsertAppForm.value).subscribe((res: any) => {
      if (res.success) {
        this.containerToaster.showSuccess('Success: App configurations updated');
        this.router.navigate(['/container']);
      } else {
        this.containerToaster.showSuccess('Warning: App configurations not updated');
      }
    }, err => {
      this.containerToaster.showError(err.message);
    });
  }
  createConfiguration() {

    if (this.upsertAppForm.value.preloadURLS && this.upsertAppForm.value.preloadURLS.length) {
      this.upsertAppForm.value.preloadURLS.forEach(element => {
        element.topic = this.upsertAppForm.value.namespace + '-' + element.name;
      });
    }
    this.CrudServices.createConfigurationData(this.upsertAppForm.value).subscribe((res: any) => {
      if (res.success) {
        this.containerToaster.showSuccess('Success: New App configurations created');
        this.router.navigate(['/container']);
      } else {
        this.containerToaster.showSuccess('Warning: New App configurations not created');
      }
    }, err => {
      this.containerToaster.showError(err.message);
    });
  }
  get f() {
    return this.upsertAppForm.controls;
  }

  createDataControl(rank) {
    return this.fb.group({
      name: ['', [
        Validators.required
      ]],
      url: ['', [
        Validators.required
      ]],
      label: ['', [
        Validators.required
      ]],
      isLandingPage: [false, [
        Validators.required
      ]],
      isNavbar: [false, [
        Validators.required
      ]],
      isActive: [false, [
        Validators.required
      ]],
      rank: [rank, [
        Validators.required
      ]],
      apiUrl: ['', [
        Validators.required
      ]],
      groupName: [''],
      isGroup: [false, [
        Validators.required
      ]],
      _id: [''],
      routePath: [''],
      mainApp: [''],
    });
  }
  setDataControl(data) {
    return this.fb.group({
      name: [data.name, [
        Validators.required
      ]],
      url: [data.url, [
        Validators.required
      ]],
      label: [data.label, [
        Validators.required
      ]],
      isLandingPage: [data.isLandingPage, [
        Validators.required
      ]],
      isNavbar: [data.isNavbar, [
        Validators.required
      ]],
      isActive: [data.isActive, [
        Validators.required
      ]],
      rank: [data.rank, [
        Validators.required
      ]],
      apiUrl: [data.apiUrl, [
        Validators.required
      ]],
      groupName: [data.groupName],
      isGroup: [data.isGroup, [
        Validators.required
      ]],
      _id: [data._id],
      routePath: [data.routePath],
      mainApp: [data.mainApp],
    });
  }

  dataControl() {
    return this.f.microApps as FormArray;
  }

  dataControls() {
    return (this.upsertAppForm.get('microApps') as FormArray).controls;
  }

  addDataControl() {
    const rank = this.dataControl().length + 1;
    this.dataControl().push(this.createDataControl(rank));
  }
  removeDataControl(index) {
    if (this.dataControl().length === 1) {
      this.containerToaster.showWarning('Warning: Atleast one micro app configuration needed');
    } else {
      this.dataControl().removeAt(index);
    }
  }
  shiftDataControlDown(index) {
    if (this.dataControl().length === 1 || (this.dataControl().length - 1 === index)) {
      this.containerToaster.showWarning('Warning: Already at Bottom');
    } else {
      const currentApp = this.dataControls()[index];
      const seatingApp = this.dataControls()[index + 1];
      currentApp['controls'].rank.setValue(index + 2);
      seatingApp['controls'].rank.setValue(index + 1);
      this.dataControls()[index + 1] = currentApp;
      this.dataControls()[index] = seatingApp;
    }

  }
  shiftDataControlUp(index) {
    if (this.dataControl().length === 1 || (index === 0)) {
      this.containerToaster.showWarning('Warning: Already at Top');
    } else {
      const currentApp = this.dataControls()[index];
      const seatingApp = this.dataControls()[index - 1];
      seatingApp['controls'].rank.setValue(index + 1);
      currentApp['controls'].rank.setValue(index);
      this.dataControls()[index - 1] = currentApp;
      this.dataControls()[index] = seatingApp;
    }

  }

  createPreloadControl(rank) {
    return this.fb.group({
      name: ['', [
        Validators.required
      ]],
      url: ['', [
        Validators.required
      ]],
      isActive: [false, [
        Validators.required
      ]],
      rank: [rank, [
        Validators.required
      ]]
    });
  }
  setPreloadControl(data) {
    return this.fb.group({
      name: [data.name, [
        Validators.required
      ]],
      url: [data.url, [
        Validators.required
      ]],
      isActive: [data.isActive, [
        Validators.required
      ]],
      rank: [data.rank, [
        Validators.required
      ]]
    });
  }

  preloadControl() {
    return this.f.preloadURLS as FormArray;
  }

  preloadControls() {
    return (this.upsertAppForm.get('preloadURLS') as FormArray).controls;
  }

  addPreloadControl() {
    const rank = this.preloadControl().length + 1;
    this.preloadControl().push(this.createPreloadControl(rank));
  }
  removePreloadControl(index) {
    if (this.preloadControl().length === 1) {
      this.containerToaster.showWarning('Warning: Atleast one preload configuration needed');
    } else {
      this.preloadControl().removeAt(index);
    }
  }
  shiftPreloadControlDown(index) {
    if (this.preloadControl().length === 1 || (this.preloadControl().length - 1 === index)) {
      this.containerToaster.showWarning('Warning: Already at Bottom');
    } else {
      const currentApp = this.preloadControls()[index];
      const seatingApp = this.preloadControls()[index + 1];
      currentApp['controls'].rank.setValue(index + 2);
      seatingApp['controls'].rank.setValue(index + 1);
      this.preloadControls()[index + 1] = currentApp;
      this.preloadControls()[index] = seatingApp;
    }

  }
  shiftPreloadControlUp(index) {
    if (this.preloadControl().length === 1 || (index === 0)) {
      this.containerToaster.showWarning('Warning: Already at Top');
    } else {
      const currentApp = this.preloadControls()[index];
      const seatingApp = this.preloadControls()[index - 1];
      seatingApp['controls'].rank.setValue(index + 1);
      currentApp['controls'].rank.setValue(index);
      this.preloadControls()[index - 1] = currentApp;
      this.preloadControls()[index] = seatingApp;
    }

  }

  resetLandingPage(value, index) {
    const isGroup = this.dataControls()[index].get('isGroup').value;
    const groupName = this.dataControls()[index].get('groupName').value;
    this.dataControls().forEach((mapp: any, i) => {
      if (value && mapp.controls.isGroup.value && isGroup && mapp.controls.groupName.value === groupName) {
        if (index === i) {
          mapp.controls.isNavbar.setValue(false);
        } else {
          mapp.controls.isLandingPage.setValue(false);
        }
      } else if (value && !mapp.controls.isGroup.value && !isGroup && mapp.controls.groupName.value === groupName) {
        if (index === i) {
          mapp.controls.isNavbar.setValue(false);
        } else {
          mapp.controls.isLandingPage.setValue(false);
        }
      }
    });
  }
  resetNavbar(value, index) {
    const isGroup = this.dataControls()[index].get('isGroup').value;
    const groupName = this.dataControls()[index].get('groupName').value;
    this.dataControls().forEach((mapp: any, i) => {
      if (value && mapp.controls.isGroup.value && isGroup && mapp.controls.groupName.value === groupName) {
        if (index === i) {
          mapp.controls.isLandingPage.setValue(false);
        } else {
          mapp.controls.isNavbar.setValue(false);
        }
      } else if (value && !mapp.controls.isGroup.value && !isGroup && mapp.controls.groupName.value === groupName) {
        if (index === i) {
          mapp.controls.isLandingPage.setValue(false);
        } else {
          mapp.controls.isNavbar.setValue(false);
        }
      }
    });
  }
  onSubmit() {

    console.log('Form value: ', this.upsertAppForm.value);

  }
  enableGroupName(value, i) {
    if (value) {
      (this.dataControls()[i] as any).controls.groupName.setValidators(Validators.required);
    } else {
      (this.dataControls()[i] as any).controls.groupName.clearValidators();
    }
  }

  sliderChange(index, $event) {
    console.log('index: ', index);
    console.log('value: ', $event);
  }
  notifyActivation(value) {
    if (value) {
      this.containerToaster.showInfo('Info: Browser reload needed to render this App');
    }
  }
}
