import { Row, Col, Container } from "react-bootstrap";
import { useState } from "react";
import Layout from "../../Layout/Layout";
import HelpDataSideBar from "../../components/HelpData/HelpDataSideBar"
import DataTable from "../../components/HelpData/DataTable";
import useFetchHelpDataAll from "../../customHooks/useFetchHelpDataAll";
import "../../assets/css/helpdata.css";

function Ligands() {

  const title = "Ligands"
  const [searchString, setSearchString] = useState();
  const { data, loading, error } = useFetchHelpDataAll('https://pycom.brunel.ac.uk/api/get-ligand-list')

  const columns = [
    {
      Header: 'Ligand Name',
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
export default Ligands;
