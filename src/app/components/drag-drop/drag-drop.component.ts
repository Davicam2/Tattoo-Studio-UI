import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss']
})
export class DragDropComponent implements OnInit {
  @ViewChild('fileControl') fileControl;
  @Output() loadedImages = new EventEmitter<any[]>();

  uploadedImageArray: any[] = [];
  uploadedImageThumbnailArray: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }


  onFilesAdded(inputFiles: any = null){
    let filesInControl: any;
    const reader = new FileReader();

    if(!inputFiles){
      filesInControl = this.fileControl.nativeElement.files;
    } else{
      filesInControl = inputFiles;
    }

    if(filesInControl.length == 0) return;
    
    for(let file of filesInControl){
      this.uploadedImageArray.push(file);
      reader.readAsDataURL(file);
      reader.onload = () =>{
        this.uploadedImageThumbnailArray.push(reader.result as string)
      }
    }
    this.loadedImages.emit(this.uploadedImageArray);
  }
  
  setDragDropArea(){
    let dropArea = document.getElementById('drop-area');

    dropArea.addEventListener(
      'dragover',
      (event: any) =>{
        event.preventDefault();
      },
      false
    )

    dropArea.addEventListener(
      'drop',
      (event: any) => {
        event.preventDefault();
        let dt = event.dataTransfer;
        let files = dt.files;

        this.onFilesAdded(files);
      }
    )
  }

}
