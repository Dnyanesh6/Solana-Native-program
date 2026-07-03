use solana_program::entrypoint::{ProgramResult};
use solana_program::entrypoint;
use solana_program::pubkey::Pubkey;
use solana_program::account_info::{AccountInfo, next_account_info};
use borsh::{BorshDeserialize, BorshSerialize};

entrypoint!(process_data_instruction);

// #[derive(BorshSerialize, BorshDeserialize)]
// struct  Counter{
//     count: u32,
//     authority: Pubkey,
// }

// #[derive(BorshSerialize, BorshDeserialize)]
// enum InstructionData {
//     Increase, // 0 for increase, 1 for decrease
//     Decrease,
//     Init
// }

// pub fn process_instruction(
//     _pubkey: &Pubkey, // the public key of the program
//     accounts: &[AccountInfo],  //read from counter account [Counter Account]
//     instruction_data: &[u8], //icrease or decrease the counter based on the instruction data
// ) -> ProgramResult {
//     // Check if the counter account is a signer
//     let mut iter = accounts.iter();
//     let counter_account = next_account_info(&mut iter)?;
//     let user_account = next_account_info(&mut iter)?;

//     if !user_account.is_signer {
//         return Err(solana_program::program_error::ProgramError::MissingRequiredSignature);
//     }



//     // Read the current data from the blockchain

//     // Deserialize the counter account data into a Counter struct
//     // took the data from the counter account and converted it into a Counter struct
//     let mut counter = Counter::try_from_slice(&counter_account.data.borrow())?;
    
//     let instruction = InstructionData::try_from_slice(instruction_data)?;

//     // increase/ decrease the current data based on the expression type
//     match instruction {
//         InstructionData::Init =>{
//             if !counter_account.is_signer {
//                 return Err(solana_program::program_error::ProgramError::MissingRequiredSignature);
//             }
//             counter.count = 0;
//             counter.authority = *user_account.key;
//         }
//         InstructionData::Decrease => {
//             counter.count -= 1;
//             if counter.authority != *user_account.key {
//                 return Err(solana_program::program_error::ProgramError::IllegalOwner);
//             }
//         }
//         InstructionData::Increase => {
//             counter.count += 1;
//             if counter.authority != *user_account.key {
//                 return Err(solana_program::program_error::ProgramError::IllegalOwner);
//             }
//         }
//     }
    
//     // Write the updated data back to the blockchain
//     counter.serialize(&mut *counter_account.data.borrow_mut())?;
    
//     Ok(())
// }

#[derive(BorshSerialize, BorshDeserialize)]
struct OnchainData {
    count: u32,
}

pub fn process_data_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo], //[data account]
    instruction_data: &[u8],
) -> ProgramResult {
    let mut iter = accounts.iter();

    let data_account = next_account_info(&mut iter)?;

    let mut counter = OnchainData::try_from_slice(&data_account.data.borrow_mut())?;

    if counter.count == 0 {
        counter.count = 1;
    } else {
        counter.count *= 2;
    }

    counter.serialize(&mut *data_account.data.borrow_mut())?;

    Ok(())

}