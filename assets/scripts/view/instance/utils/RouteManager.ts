
export class RouteItem {
    id: string;
    startEvent: string;
    CompleteEvent: string;
    addAction(): void {

    }
}

export default class RouteManager {

    line: RouteItem[];
    // {id:string，data:line}
    allLines: any = {};

    static get instance() {
        return gdk.Tool.getSingleton(RouteManager);
    }

}