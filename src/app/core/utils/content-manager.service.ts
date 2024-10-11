import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiService } from "../api.service";
import { Response } from "../../interfaces/api/response";
import {
  ContentManager,
  Document,
  DocumentHistory,
} from "../../interfaces/config/content-manager";

@Injectable({
  providedIn: "root",
})
export class ContentManagerService {
  constructor(private api: ApiService) { }

  public create(content: {
    provider: 0;
    properties: {
      additionalProp1: "string";
      additionalProp2: "string";
      additionalProp3: "string";
    };
  }): Observable<boolean> {
    return this.api.post<boolean>("contentmanager/configuration", content);
  }

  public delete(): Observable<boolean> {
    return this.api.delete<boolean>("contentmanager/configuration");
  }

  public createFolder(
    content: Pick<
      ContentManager,
      "name" | "description" | "parentId" | "order" | "isPublic"
    >
  ): Observable<ContentManager> {
    return this.api.post<ContentManager>("contentmanager/folder", content);
  }

  public updateFolder(
    id: string,
    content: Pick<
      ContentManager,
      "name" | "description" | "parentId" | "order" | "isPublic"
    >
  ): Observable<ContentManager> {
    return this.api.put<ContentManager>(
      "contentmanager/folder/" + id,
      content
    );
  }

  public deleteFolder(id: string): Observable<boolean> {
    return this.api.delete<boolean>("contentmanager/folder/" + id);
  }

  public getFolderById(id: string): Observable<ContentManager[]> {
    return this.api.get<ContentManager[]>("contentmanager/folder/" + id);
  }

  public getChildsByParent(
    parentId: string
  ): Observable<ContentManager[]> {
    return this.api.get<ContentManager[]>(
      "contentmanager/folder/" + parentId + "/childs"
    );
  }

  public getRoots(): Observable<ContentManager[]> {
    return this.api.get<ContentManager[]>("contentmanager/folder/roots");
  }

  public createDocument(content: Blob): Observable<boolean> {
    return this.api.post<boolean>("contentmanager/document", content);
  }

  public downloadDocument(
    documentId: string,
    password: string
  ): Observable<string> {
    return this.api.post<string>("contentmanager/document/download", {
      documentId,
      password,
    });
  }

  public deleteDocument(documentId: string): Observable<boolean> {
    return this.api.delete<boolean>(
      "contentmanager/document/" + documentId
    );
  }

  public restoreDocument(documentId: string): Observable<boolean> {
    return this.api.put<boolean>(
      "contentmanager/document/" + documentId + "/restore"
    );
  }

  public moveDocument(
    documentId: string,
    folderId: string
  ): Observable<boolean> {
    return this.api.put<boolean>(
      "contentmanager/document/" +
      documentId +
      "/movetofolder/" +
      folderId
    );
  }

  public getDocument(): Observable<Document[]> {
    return this.api.get<Document[]>("contentmanager/document/list");
  }

  public getDocumentByFolder(
    folderId: string
  ): Observable<Document[]> {
    return this.api.get<Document[]>(
      "contentmanager/document/listbyfolder/" + folderId
    );
  }

  public getDocumentHistory(
    documentId: string
  ): Observable<DocumentHistory[]> {
    return this.api.get<DocumentHistory[]>(
      "contentmanager/document/" + documentId + "/history"
    );
  }
}
