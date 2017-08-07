export const getBreadcrumbs = (pathname, panelBreadcrumbs) => {
    const withoutQuery = pathname.split('?')[0];
    const route = panelBreadcrumbs ?
        withoutQuery.split('/panel/')[1] :
        withoutQuery.split('/panel/')[0];
    const parts = route.split('/').filter(p => !!p);
    const withoutPanel = withoutQuery.split('/panel/')[0];
    let base = panelBreadcrumbs ?
        `${withoutQuery.split('/panel/')[0]}/panel` :
        '';
    const routes = parts.map((part) => {
        base = `${base}/${part}`;
        return base;
    });

    // prefix with uprofile breadcrumb
    if (panelBreadcrumbs && !parts.includes('uprofile')) {
        parts.unshift('uprofile');
        routes.unshift(`${withoutPanel}/panel/uprofile`);
    }

    return { parts, routes };
};
