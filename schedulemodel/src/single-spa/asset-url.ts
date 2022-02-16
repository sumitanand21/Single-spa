// In single-spa, the assets need to be loaded from a dynamic location,
// instead of hard coded to `/assets`. We use webpack public path for this.
// See https://webpack.js.org/guides/public-path/#root

export function assetUrl(url: string): string {
  // @ts-ignore
  const publicPath = __webpack_public_path__;
  const publicPathSuffix = publicPath.endsWith('/') ? '' : '/';
  const urlPrefix = url.startsWith('/') ? '' : '/';

  return `${publicPath}${publicPathSuffix}assets${urlPrefix}${url}`;
}

export function hostUrl(url?: string): string {
  // @ts-ignore
  const publicPath = __webpack_public_path__;
  const publicPathSuffix = publicPath.endsWith('/') ? '' : '/';

  if (url) {
    return `${publicPath}${publicPathSuffix}${url}`;
  } else {
    return `${publicPath}${publicPathSuffix}`;
  }
}

export function setWebpackPath(url?: string) {
  // @ts-ignore
  __webpack_public_path__ = url.replace('main-es2015.js', '');
}
