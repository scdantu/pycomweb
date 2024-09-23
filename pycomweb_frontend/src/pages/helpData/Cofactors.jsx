import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";
import Layout from "../../Layout/Layout";
import HelpDataSideBar from "../../components/HelpData/HelpDataSideBar"
import DataTable from "../../components/HelpData/DataTable";
import useFetchHelpDataAll from "../../customHooks/useFetchHelpDataAll";
import "../../assets/css/helpdata.css";

function Cofactors() {

  const title = "Cofactors"
  const [searchString, setSearchString] = useState();
  const { data, loading, error } = useFetchHelpDataAll('https://pycom.brunel.ac.uk/api/get-cofactor-list')

  const columns = [
    {
      Header: 'Cofactor ID',
      accessor: 'cofactorId',
    },
    {
      Header: 'Cofactor',
      accessor: 'cofactorName',
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
export default Cofactors;
