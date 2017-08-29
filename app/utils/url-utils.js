export const getBreadcrumbs = (pathname, panelBreadcrumbs) => {
    const withoutQuery = pathname.split('?')[0];
    const route = panelBreadcrumbs ?
        withoutQuery.split('/panel/')[1] :
        withoutQuery.split('/panel/')[0];
    const parts = route.split('/').filter(p => !!p);
    let base = '';
    const routes = parts.map((part) => {
        if (panelBreadcrumbs && !base) {
            base = part;
        } else {
            base = `${base}/${part}`;
        }
        return base;
    });

    // prefix with uprofile breadcrumb
    if (panelBreadcrumbs && !parts.includes('uprofile')) {
        parts.unshift('uprofile');
        routes.unshift('uprofile');
    }

    return { parts, routes };
};
