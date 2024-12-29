import * as Overview from 'resource:///org/gnome/shell/ui/overview.js';

// import * as Config from 'resource:///org/gnome/shell/misc/config.js'; // currently unused, but
// const Version = parseInt(Config.PACKAGE_VERSION.split('.')[0]); // probably will be needed later

let oldOverview;

function overviewToggle()
{
    if (this.isDummy)
    {
        return;
    }

    if (this.visible)
    {
        this.hide();
        return;
    }

    this.showApps();
}

export default class ShowApplicationsInsteadOfWorkspaces
{
    init()
    {
        oldOverview = Overview.Overview.prototype['toggle'];
    }

    enable()
    {
        Overview.Overview.prototype['toggle'] = overviewToggle;
    }

    disable()
    {
        Overview.Overview.prototype['toggle'] = oldOverview;
    }
}
