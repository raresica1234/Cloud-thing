import {observer} from "mobx-react";
import {PropsWithChildren} from "react";
import ExplorerResponse from "../../../accessors/types/explorer-response";
import FolderIcon from '@mui/icons-material/Folder';
import {Card, CardContent, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

interface Props {
	explorerResponse: ExplorerResponse;
}

const Directory = ({explorerResponse}: PropsWithChildren<Props>) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/explore?path=${explorerResponse.absolutePath}`)
	}

	return <Card onClick={e => handleClick()}>
		<CardContent sx={{justifyContent: "center"}}>
			<FolderIcon sx={{fontSize:100 }}/>
			<Typography>
				{explorerResponse.name}
			</Typography>
		</CardContent>
	</Card>
}

export default Directory
