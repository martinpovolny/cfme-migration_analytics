import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, noop } from 'patternfly-react';
import Toolbar from './components/Toolbar';
import AnalyticsEmptyState from './screens/AnalyticsEmptyState';
import AnalyticsSummary from './screens/AnalyticsSummary';
import AnalyticsProviderSelection from './screens/AnalyticsProviderSelection';
import AnalyticsDataCollection from './screens/AnalyticsDataCollection';
// import BreadcrumbPageSwitcher from '../common/BreadcrumbPageSwitcher'; // TODO: figure out how to share the breadcrumb switcher with v2v

const SCREENS = {
  EMPTY_STATE: 'EMPTY_STATE',
  SUMMARY: 'SUMMARY',
  PROVIDER_SELECTION: 'PROVIDER_SELECTION',
  DATA_COLLECTION: 'DATA_COLLECTION'
};

class Analytics extends React.Component {
  state = { currentScreen: SCREENS.EMPTY_STATE };

  componentDidMount() {
    this.props.fetchManifestInfoAction();
  }

  goToSummary = () => this.setState({ currentScreen: SCREENS.SUMMARY });
  goToProviderSelection = () => this.setState({ currentScreen: SCREENS.PROVIDER_SELECTION });
  goToDataCollection = () => this.setState({ currentScreen: SCREENS.DATA_COLLECTION });

  renderCurrentScreen = () => {
    const screens = {
      [SCREENS.EMPTY_STATE]: <AnalyticsEmptyState onGetStartedClick={this.goToSummary} />,
      [SCREENS.SUMMARY]: <AnalyticsSummary onCollectInventoryClick={this.goToProviderSelection} />,
      [SCREENS.PROVIDER_SELECTION]: (
        <AnalyticsProviderSelection onContinueClick={this.goToDataCollection} onCancelClick={this.goToSummary} />
      ),
      [SCREENS.DATA_COLLECTION]: (
        <AnalyticsDataCollection onCancelClick={this.goToProviderSelection} onReturnClick={this.goToSummary} />
      )
    };
    return screens[this.state.currentScreen];
  };

  render() {
    const { manifestInfo } = this.props;
    const { currentScreen } = this.state;
    const onEmptyState = currentScreen === SCREENS.EMPTY_STATE;
    return (
      <React.Fragment>
        <Toolbar>
          <Breadcrumb.Item active>{__('Compute')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{__('Migration')}</Breadcrumb.Item>
          <Breadcrumb.Item active>
            <strong>{__('Migration Analytics')}</strong>
          </Breadcrumb.Item>
          {/* <BreadcrumbPageSwitcher activeHref="#/analytics" /> */}
          {/* TODO: figure out how to share the breadcrumb switcher with v2v */}
        </Toolbar>
        <div id="migration-analytics" className={onEmptyState ? 'row cards-pf' : ''}>
          {this.renderCurrentScreen()}
        </div>
        {manifestInfo && (
          <h6 id="migration-analytics-manifest-version" className={onEmptyState ? 'on-empty-state' : ''}>
            {__('Manifest version:')}
            &nbsp;
            {manifestInfo.manifest_version}
          </h6>
        )}
      </React.Fragment>
    );
  }
}

Analytics.propTypes = {
  fetchManifestInfoAction: PropTypes.func,
  manifestInfo: PropTypes.shape({
    manifest_version: PropTypes.string,
    using_default_manifest: PropTypes.bool
  })
};

Analytics.defaultProps = {
  fetchManifestInfoAction: noop,
  manifestInfo: null
};

export default Analytics;
