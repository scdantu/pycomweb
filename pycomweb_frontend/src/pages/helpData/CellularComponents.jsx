import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";
import Layout from "../../Layout/Layout";
import HelpDataSideBar from "../../components/HelpData/HelpDataSideBar"
import DataTable from "../../components/HelpData/DataTable";
import useFetchHelpDataAll from "../../customHooks/useFetchHelpDataAll";
import "../../assets/css/helpdata.css";

function CellularComponents() {

  const title = "Cellular Components"
  const [searchString, setSearchString] = useState();
  const { data, loading, error } = useFetchHelpDataAll('https://pycom.brunel.ac.uk/api/get-biological-process-list')
  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
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
export default CellularComponents;
