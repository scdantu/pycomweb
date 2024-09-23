import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";
import Layout from "../../Layout/Layout";
import HelpDataSideBar from "../../components/HelpData/HelpDataSideBar"
import DataTable from "../../components/HelpData/DataTable";
import useFetchHelpDataAll from "../../customHooks/useFetchHelpDataAll";
import "../../assets/css/helpdata.css";

function Organisms() {

  const title = "Organisms"
  const [searchString, setSearchString] = useState();
  const { data, loading, error } = useFetchHelpDataAll('https://pycom.brunel.ac.uk/api/get-organism-list')

  const columns = [
    {
      Header: 'Organism ID',
      accessor: 'organismId',
    },
    {
      Header: 'Scientific Name',
      accessor: 'nameScientific',
    },
    {
      Header: 'Common Name',
      accessor: 'nameCommon',
    },
    {
      Header: 'Taxonomy',
      accessor: 'taxonomy',
      width: 90
    },
  ];

  return (
    <>
      <Layout sidebar={<HelpDataSideBar />}>
        <DataTable columns={columns} data={data} title={title} searchString={searchString} setSearchString={setSearchString} />
      </Layout>
    </>
  );


}
export default Organisms;
