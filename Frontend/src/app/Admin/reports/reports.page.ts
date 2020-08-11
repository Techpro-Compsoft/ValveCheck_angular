import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/core/Services/Company/company.service';
import { ActivatedRoute } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { BaseService } from 'src/app/core/Services/base.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  selectedDate: any;
  companyId: number;
  companyName: string;
  availableFiles: Array<object>;

  constructor(public companyService: CompanyService, private activatedRoute: ActivatedRoute,
    private papa: Papa, private file: File, private plt: Platform,
    private fileOpener: FileOpener, private base: BaseService) { }

  ngOnInit() {
    this.companyId = +this.activatedRoute.snapshot.paramMap.get('compId');
    this.companyName = this.activatedRoute.snapshot.paramMap.get('compName');
    if (this.plt.is('cordova')) {
      this.fetchFiles();
    }
  }

  fetchFiles() {
    this.file.checkDir(this.file.externalRootDirectory, 'valveCheck reports').then(res => {
      if (res) {
        this.file.listDir(this.file.externalRootDirectory, 'valveCheck reports').then(
          res => {
            if (res) {
              this.availableFiles = res;
            }
          }
        );
      }
    });
  }

  myChange(event) {
    this.selectedDate = event.target.value;
    this.selectedDate = this.selectedDate.substr(0, 10);
  }

  reportSubmit() {
    if (this.selectedDate) {
      try {
        this.companyService.getReports({
          "company": this.companyId,
          "date": this.selectedDate
        }).subscribe(response => {
          if (response.status == "success" && response.data.length > 0) {
            this.columnsWork(response.data);
            let data: string = "";
            data += `${Object.keys(response['data'][0])}\n`;
            response['data'].forEach(object => {
              data += `${Object.values(object)}\n`;
            });
            this.papa.parse(data, {
              complete: parsedData => {
                const headerRow = parsedData.data.splice(0, 1)[0];
                const csvData = parsedData.data;
                this.exportCSV(headerRow, csvData);
              }
            });
          }
          else if (response.status == "success" && response.data.length === 0) {
            this.base.toastMessage('No data found');
          }
          else if (response.status == "error") {
            alert(response.txt)
          }
        });
      } catch (error) {
        this.base.toastMessage('Something went wrong');
      }
    }
    else {
      this.base.toastMessage('Please select a date');
    }
  }

  columnsWork(data: Array<object>) {
    data.forEach(ele => {
      ele['Actual Hours'] = '';
      ele['Deviation'] = '0';
      if (ele['Interruption']) {
        let initCycleTime = this.calculateTime(ele['Actual Start'], ele['Actual Stop']);
        let secondCycleTime = this.calculateTime(ele['Resume'], ele['Interruption Stop']);
        let mins = +initCycleTime.split(':')[1] + +secondCycleTime.split(':')[1];
        ele['Actual Hours'] = Math.floor(mins / 60) + 'h ' + mins % 60 + 'mins';
        let tempDiff = mins - (+ele['Hours'].split(':')[0] * 60 + +ele['Hours'].split(':')[1]);
        ele['Deviation'] = tempDiff > 0 ? '+' : '-' + Math.floor(Math.abs(tempDiff) / 60) + 'h ' + Math.abs(tempDiff) % 60 + 'mins';
      }
    });
  }

  // columnsWork(data: Array<object>) {
  //   data.forEach(ele => {
  //     let initCycleTime = this.calculateTime(ele['Actual Start'], ele['Actual Stop']);
  //     let secondCycleTime = "00:00";
  //     let mins: any;
  //     if (ele['Interruption']) {
  //       secondCycleTime = this.calculateTime(ele['Resume'], ele['Interruption Stop']);
  //     }
  //     mins = ele['Interruption'] ? +initCycleTime.split(':')[1] : +initCycleTime.split(':')[1] + +secondCycleTime.split(':')[1];
  //     ele['Actual Hours'] = Math.floor(mins / 60) + 'h ' + mins % 60 + 'mins';
  //     let tempDiff = mins - (+ele['Hours'].split(':')[0] * 60 + +ele['Hours'].split(':')[1]);
  //     ele['Deviation'] = tempDiff > 0 ? '+' : '-' + Math.floor(Math.abs(tempDiff) / 60) + 'h ' + Math.abs(tempDiff) % 60 + 'mins';
  //   });
  // }

  calculateTime(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    // If using time pickers with 24 hours format, add the below line get exact hours
    // if (hours < 0)
    //   hours = hours + 24;

    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
  }

  exportCSV(header, csvData) {
    let csv = this.papa.unparse({
      fields: header,
      data: csvData
    });
    if (this.plt.is('cordova')) {
      let path = this.file.externalRootDirectory;
      this.file.checkDir(path, 'valveCheck reports').then(_ => {
        this.writeFileNow(path, csv);
      }).catch(() => {
        this.file.createDir(path, 'valveCheck reports', true).then(
          () => {
            this.writeFileNow(path, csv);
          },
          err => this.base.toastMessage('Error in directory')
        );
      });
    }
  }

  writeFileNow(path, csv) {
    this.file.writeFile(`${path}/valveCheck reports`, `${this.companyName}_${this.selectedDate}.csv`, csv, { replace: true }).then(res => {
      if (res) {
        this.base.toastMessage('File saved successfully');
        this.fetchFiles();
      }
    }, () => {
      this.base.toastMessage('Error saving file');
    });
  }

  openFile(path) {
    this.fileOpener.open(this.file.externalRootDirectory + path, 'text/csv')
      .then(() => console.log('File is opened'))
      .catch(e => this.base.toastMessage('Error in opening file'));
  }

}