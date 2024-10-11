import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private api: ApiService) { }

  public add(name: string): void {
    this.api.post<boolean>("folder/" + name + "/add").subscribe(
      (response) => {
        if (!response) {
          return;
        }
      },
      (error) => {
        return;
      }
    );
  }

  public delete(path: string): void {
    this.api.post<boolean>("folder/delete", { path }).subscribe(
      (response) => {
        if (!response) {
          return;
        }
      },
      (error) => {
        return;
      }
    );
  }

  public rename(pathSource: string, pathDestination: string): void {
    this.api
      .post<boolean>("folder/rename", { pathSource, pathDestination })
      .subscribe(
        (response) => {
          if (!response) {
            return;
          }
        },
        (error) => {
          return;
        }
      );
  }

  public list(): void {
    this.api.get<string[]>("folder/list").subscribe(
      (response) => {
        if (!response) {
          return;
        }
      },
      (error) => {
        return;
      }
    );
  }

  public addFile(name: string): void {
    this.api.post<string>("folder/" + name + "/file/add").subscribe(
      (response) => {
        if (!response) {
          return;
        }
      },
      (error) => {
        return;
      }
    );
  }

  public deleteFile(path: string): void {
    this.api.post<boolean>("folder/file/delete", { path }).subscribe(
      (response) => {
        if (!response) {
          return;
        }
      },
      (error) => {
        return;
      }
    );
  }

  public listFile(name: string): void {
    this.api.get<string[]>("folder/" + name + "/file/list").subscribe(
      (response) => {
        if (!response) {
          return;
        }
      },
      (error) => {
        return;
      }
    );
  }
}
