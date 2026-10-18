import PropTypes from 'prop-types';
import styles from '../../../styles/ProteinDetail.module.css'; // Adjust the path as necessary

function ProteinOverviewSequence({ sequence }) {

  const formattedSequence = sequence.replace(/(.{10})/g, "$1 ");

  return (
    <div className={styles.dataGridItemSequence}>{formattedSequence}</div>
  )
}

ProteinOverviewSequence.propTypes = {
  sequence: PropTypes.string.isRequired,
};

export default ProteinOverviewSequence
