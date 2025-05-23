import PropTypes from "prop-types";
import { CookiesProvider } from "react-cookie";
import { RepositoryProvider } from "./RepositorContext";
import { DownloadProvider } from "./DownloadContext";
import { ProteinTabProvider } from "./ProteinTabContext";
import { SearchProvider } from "./SearchContext";

export const PyComProviders = ({ children }) => {
    return (
        <CookiesProvider>
            <RepositoryProvider>
                <DownloadProvider>
                    <ProteinTabProvider>
                        <SearchProvider>
                            {children}
                        </SearchProvider>
                    </ProteinTabProvider>
                </DownloadProvider>
            </RepositoryProvider>
        </CookiesProvider>
    );
}

// export default PyComProviders;

PyComProviders.propTypes = {
    children: PropTypes.any
}