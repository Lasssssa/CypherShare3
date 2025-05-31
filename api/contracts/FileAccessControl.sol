// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FileAccessControl {
    uint256 public fileCounter;

    struct SharedFileMetadata {
        uint256 fileId;
        address owner;
        string cid;
        string name;
        uint256 size;
        uint256 timestamp;
        string cryptedKey;
    }

    struct AuthorizedRecipient {
        string cryptedDecryptionKey;
        address recipient;
    }

    struct File {
        address owner;
        string cid;
        string name;
        uint256 size;
        uint256 timestamp;
        AuthorizedRecipient[] authorizedRecipients;
    }

    mapping(uint256 => File) public files;
    mapping(address => uint256[]) public filesByOwner;
    mapping(address => uint256[]) public filesSharedWith;

    event FileUploaded(uint256 indexed fileId, address indexed owner, string cid);
    event AccessGranted(uint256 indexed fileId, address indexed recipient, string cryptedKey);

    function uploadFile(
        string memory cid,
        string memory name,
        uint256 size,
        string[] memory cryptedKeys,
        address[] memory recipients
    ) external {
        require(cryptedKeys.length == recipients.length, "Input length mismatch");

        uint256 fileId = fileCounter++;
        File storage newFile = files[fileId];

        newFile.owner = msg.sender;
        newFile.cid = cid;
        newFile.name = name;
        newFile.size = size;
        newFile.timestamp = block.timestamp;

        for (uint256 i = 0; i < recipients.length; i++) {
            AuthorizedRecipient memory auth;
            auth.cryptedDecryptionKey = cryptedKeys[i];
            auth.recipient = recipients[i];
            newFile.authorizedRecipients.push(auth);

            filesSharedWith[recipients[i]].push(fileId);
            emit AccessGranted(fileId, recipients[i], cryptedKeys[i]);
        }

        filesByOwner[msg.sender].push(fileId);
        emit FileUploaded(fileId, msg.sender, cid);
    }

    function getMyFiles() external view returns (uint256[] memory) {
        return filesByOwner[msg.sender];
    }

    function getFilesSharedWithMe() external view returns (uint256[] memory) {
        return filesSharedWith[msg.sender];
    }

    function isAuthorized(uint256 fileId, address user) public view returns (bool) {
        File storage f = files[fileId];
        if (f.owner == user) return true;

        for (uint256 i = 0; i < f.authorizedRecipients.length; i++) {
            if (f.authorizedRecipients[i].recipient == user) return true;
        }

        return false;
    }

    function getFileMetadata(uint256 fileId) external view returns (
        address owner,
        string memory cid,
        string memory name,
        uint256 size,
        uint256 timestamp
    ) {
        require(isAuthorized(fileId, msg.sender), "Not authorized");

        File storage f = files[fileId];
        return (f.owner, f.cid, f.name, f.size, f.timestamp);
    }

    function getMyDecryptionKey(uint256 fileId) external view returns (string memory) {
        require(isAuthorized(fileId, msg.sender), "Not authorized");

        File storage f = files[fileId];

        for (uint256 i = 0; i < f.authorizedRecipients.length; i++) {
            if (f.authorizedRecipients[i].recipient == msg.sender) {
                return f.authorizedRecipients[i].cryptedDecryptionKey;
            }
        }

        revert("No decryption key found for you");
    }

    function getFilesSharedWithUser(address user) external view returns (SharedFileMetadata[] memory) {
        uint256[] memory sharedFileIds = filesSharedWith[user];
        uint256 length = sharedFileIds.length;

        SharedFileMetadata[] memory sharedFiles = new SharedFileMetadata[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 fileId = sharedFileIds[i];
            File storage file = files[fileId];

            string memory userKey = "";
            for (uint256 j = 0; j < file.authorizedRecipients.length; j++) {
                if (file.authorizedRecipients[j].recipient == user) {
                    userKey = file.authorizedRecipients[j].cryptedDecryptionKey;
                    break;
                }
            }

            sharedFiles[i] = SharedFileMetadata({
                fileId: fileId,
                owner: file.owner,
                cid: file.cid,
                name: file.name,
                size: file.size,
                timestamp: file.timestamp,
                cryptedKey: userKey
            });
        }

        return sharedFiles;
    }

    function getFilesByOwner(address owner) external view returns (uint256[] memory) {
        return filesByOwner[owner];
    }
}
