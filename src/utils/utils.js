export const groupConsecutiveMessages = (messages) => {
  const groupedMessages = [];
  let currentGroup = [];

  for (let i = 0; i < messages.length; i++) {
    const currentMessage = messages[i];
    const previousMessage = messages[i - 1];

    if (
      !previousMessage ||
      currentMessage.sender._id !== previousMessage.sender._id
    ) {
      if (currentGroup.length > 0) {
        groupedMessages.push([...currentGroup]);
      }
      currentGroup = [currentMessage];
    } else {
      currentGroup.push(currentMessage);
    }
  }

  if (currentGroup.length > 0) {
    groupedMessages.push([...currentGroup]);
  }

  return groupedMessages;
};
