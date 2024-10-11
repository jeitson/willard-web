import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { Generic, Option, OptionInsert } from "../../interfaces/config/generic";

@Injectable({
  providedIn: "root",
})
export class OptionListService {
  constructor(private api: ApiService) { }

  public getById(itemId: string): void {
    this.api.get<Generic>("item/" + itemId);
  }

  public getListByKey(key: string): void {
    this.api.get<Option[]>("item/listbykey/" + key);
  }

  public getListByKeyCommon(key: string): void {
    this.api.get<Option[]>("item/listbykey/" + key + "/common");
  }

  public getListByParent(key: string, parentId: string): void {
    this.api
      .get<Option[]>("item/listbyparent/" + key + "/" + parentId);
  }

  public getDetailListByKey(key: string): void {
    this.api.get<Generic[]>("item/detail/" + key + "/list");
  }

  public create(content: Generic): void {
    this.api.post<boolean>("item/add", content);
  }

  public getListByKeys(content: string[]): void {
    this.api.post<Option[]>("item/listbykeys", content);
  }

  public changeOrder(id: string, order: string): void {
    this.api.put<boolean>("item/" + id + "/changeorder/" + order);
  }

  public changeParent(id: string, parentId: string): void {
    this.api
      .put<boolean>("item/" + id + "/changeparent/" + parentId);
  }

  public changeStatus(id: string): void {
    this.api.put<boolean>("item/" + id + "/changestatus");
  }

  public update(id: string, content: OptionInsert): void {
    this.api.put<boolean>("item/update/" + id, content);
  }

  public delete(id: string): void {
    this.api.delete<boolean>("item/delete/" + id);
  }
}
