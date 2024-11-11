import PropTypes from "prop-types";
import { RepositoryProvider } from "./RepositorContext";
import { DownloadProvider } from "./DownloadContext";
import { ProteinTabProvider } from "./ProteinTabContext";
import { SearchProvider } from "./SearchContext";

export const PyComProviders = ({ children }) => {
    return (
        <RepositoryProvider>
            <DownloadProvider>
                <ProteinTabProvider>
                    <SearchProvider>
                        {children}
                    </SearchProvider>
                </ProteinTabProvider>
            </DownloadProvider>
        </RepositoryProvider>
    );
}

// export default PyComProviders;

PyComProviders.propTypes = {
    children: PropTypes.any
}