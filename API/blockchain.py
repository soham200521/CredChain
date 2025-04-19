import os
import json
from web3 import Web3
from eth_account import Account
from web3.middleware import geth_poa_middleware
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
load_dotenv()

# Blockchain Configuration
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
OWNER_PRIVATE_KEY = os.getenv('OWNER_PRIVATE_KEY')
INFURA_URL = os.getenv('INFURA_URL')

# Load ABI from artifacts
BASE_DIR = Path(__file__).parent.parent
ABI_PATH = BASE_DIR / "artifacts" / "contracts" / "CredChain.sol" / "CredChain.json"

# Initialize Web3 connection
def get_web3_contract():
    try:
        with open(ABI_PATH) as f:
            contract_json = json.load(f)
            CONTRACT_ABI = contract_json['abi']
        
        w3 = Web3(Web3.HTTPProvider(INFURA_URL))
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        return w3, contract
    except Exception as e:
        print(f"Error connecting to blockchain: {str(e)}")
        return None, None

def store_on_blockchain(user_address, score):
    try:
        # Convert score to uint256 (scale if needed)
        scaled_score = int(score * 100)  # Example: 750.5 becomes 75050
        
        w3, contract = get_web3_contract()
        if not w3 or not contract:
            return None
        
        # Get owner account from private key
        account = Account.from_key(OWNER_PRIVATE_KEY)
        
        # Build transaction
        tx = contract.functions.updateScore(
            Web3.to_checksum_address(user_address),
            scaled_score
        ).build_transaction({
            'chainId': 11155111,  # Sepolia testnet
            'gas': 200000,
            'gasPrice': w3.to_wei('50', 'gwei'),
            'nonce': w3.eth.get_transaction_count(account.address),
        })
        
        # Sign and send transaction
        signed_tx = w3.eth.account.sign_transaction(tx, OWNER_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        # Wait for transaction receipt (optional)
        # w3.eth.wait_for_transaction_receipt(tx_hash)
        
        return tx_hash.hex()
    
    except Exception as e:
        print(f"Blockchain storage error: {str(e)}")
        return None

def get_score_from_blockchain(user_address):
    try:
        w3, contract = get_web3_contract()
        if not w3 or not contract:
            return None
        
        score = contract.functions.getScore(Web3.to_checksum_address(user_address)).call()
        return score / 100  # Convert back from scaled value
    
    except Exception as e:
        print(f"Error getting score from blockchain: {str(e)}")
        return None
