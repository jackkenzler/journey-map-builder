import step01Before from '../../../comparisons/step-01-landing-pages-before.jpg';
import step01After from '../../../comparisons/step-01-landing-pages-after.jpg';
import step02Before from '../../../comparisons/step-02-class-search-link-before.jpg';
import step02After from '../../../comparisons/step-02-class-search-link-after.jpg';
import step03Before from '../../../comparisons/step-03-signin-to-continue-before.jpg';
import step03After from '../../../comparisons/step-03-signin-to-continue-after.jpg';
import step04Before from '../../../comparisons/step-04-unified-application-before.jpg';
import step04After from '../../../comparisons/step-04-unified-application-after.jpg';
import step05Before from '../../../comparisons/step-05-applies-for-class-before.jpg';
import step05After from '../../../comparisons/step-05-applies-for-class-after.jpg';
import step06Before from '../../../comparisons/step-06-next-steps-comms-before.jpg';
import step06After from '../../../comparisons/step-06-next-steps-comms-after.jpg';
import step07Before from '../../../comparisons/step-07-track-application-status-before.jpg';
import step07After from '../../../comparisons/step-07-track-application-status-after.jpg';
import step08Before from '../../../comparisons/step-08-myasu-admitted-before.jpg';
import step08After from '../../../comparisons/step-08-myasu-admitted-after.jpg';
import step09Before from '../../../comparisons/step-09-seamless-registration-before.jpg';
import step09After from '../../../comparisons/step-09-seamless-registration-after.jpg';
import step10Before from '../../../comparisons/step-10-tuition-payment-before.jpg';
import step10After from '../../../comparisons/step-10-tuition-payment-after.jpg';

// Keyed by future state marker index (0-based).
// Step number = marker index + 1
export const comparisonImages: Record<number, { before: string; after: string }> = {
  0:  { before: step01Before, after: step01After },  // Consistent policies on landing pages
  1:  { before: step02Before, after: step02After },  // Links from Class Search to application
  2:  { before: step03Before, after: step03After },  // Sign in to continue
  3:  { before: step04Before, after: step04After },  // Starts a unified application
  4:  { before: step05Before, after: step05After },  // Applies for a class
  5:  { before: step06Before, after: step06After },  // Gets application confirmation email
  6:  { before: step07Before, after: step07After },  // Tracks application status
  7:  { before: step08Before, after: step08After },  // Sees admission decision
  8:  { before: step09Before, after: step09After },  // Enrolls in the class
  9:  { before: step10Before, after: step10After },  // Pays tuition clearly
};
