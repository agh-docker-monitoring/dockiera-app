import React, { useState } from "react";
import { Box, Container, Button } from "@material-ui/core";
import AddHostDialog from "../AddHostDialog/AddHostDialog";

const Home: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setIsOpen(true)}
        >
          Add host
        </Button>
      </Box>
      <AddHostDialog isOpen={isOpen} onClose={handleClose} />
    </Container>
  );
};

export default Home;