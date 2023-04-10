import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    AddTask,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
    AvTimer,
    Widgets,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import TimerWidget from "./TimerWidget";
import RoutineWidget from "./RoutineWidget";

const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [isTimer, setIsTimer] = useState(false);
    const [isRoutine, setIsRoutine] = useState(false);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const durationRef = useRef(0);
    const routineRef = useRef("");
    const [timers, setTimers] = useState([]);
    const [routines, setRoutines] = useState([]);

    const handlePost = async () => {
        if (isTimer) {
            setTimers(oldArray => [...oldArray, durationRef.current.value]);
            setIsTimer(false);
            return;
        }
        if (isRoutine) {
            setRoutines(oldArray => [...oldArray, routineRef.current.value]);
            setIsRoutine(false);
            return;
        }
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("description", post);
        if (image) {
            formData.append("picture", image);
            formData.append("picturePath", image.name);
        }

        const response = await fetch(`http://localhost:3001/posts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("");

    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <FlexBetween>
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    width="100%"
                                    sx={{ "&:hover": { cursor: "pointer" } }}
                                >
                                    <input {...getInputProps()} />
                                    {!image ? (
                                        <p>Add Image Here</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{image.name}</Typography>
                                            <EditOutlined />
                                        </FlexBetween>
                                    )}
                                </Box>
                                {image && (
                                    <IconButton
                                        onClick={() => setImage(null)}
                                        sx={{ width: "15%" }}
                                    >
                                        <DeleteOutlined />
                                    </IconButton>
                                )}
                            </FlexBetween>
                        )}
                    </Dropzone>
                </Box>
            )}

            {isTimer && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <form>
                        <label>Duration: </label>
                        <input type="text" id="duration" ref={durationRef} />
                    </form>
                </Box>
            )}
            {isRoutine && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <form>
                        <label>Routine Name: </label>
                        <input type="text" id="routinename" ref={routineRef} />
                    </form>
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem" onClick={() => { setIsRoutine((routine) => !routine); setPost(true); }}>
                            <AddTask sx={{ color: mediumMain }} />
                            <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>Routine</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem" onClick={() => { setIsTimer((time) => !time); setPost(true); }}>
                            <AvTimer sx={{ color: mediumMain }} />
                            <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>Timer</Typography>
                        </FlexBetween>
                    </>
                ) : (
                    <FlexBetween gap="0.25rem">
                        <MoreHorizOutlined sx={{ color: mediumMain }} />
                    </FlexBetween>
                )}

                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
            {timers.map((tim, idx) => (
                <TimerWidget key={idx} duration={tim} />
            ))}
            {routines.map((rout, idx) => (
                <RoutineWidget key={rout+idx} routine={rout} />
            ))}
        </WidgetWrapper>
    );
};

export default MyPostWidget;