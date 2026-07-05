use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey, entrypoint};
use solana_program::account_info::next_account_info;
use solana_program::instruction::Instruction;
use solana_program::program::invoke;
use solana_program::instruction::AccountMeta;

entrypoint!(process_instruction);

pub fn process_instruction(
    publicKey: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let mut iter = accounts.iter();
    let data_account = next_account_info(&mut iter)?;
    let double_contract_address = next_account_info(&mut iter)?.key;
    let instruction = Instruction {
        program_id: *double_contract_address,
        accounts: vec![
            AccountMeta{
                is_signer: true,
                is_writable: true,
                pubkey: *data_account.key,
            },
        ],
        data: vec![],
    };
    
    invoke(&instruction, &[data_account.clone()])?;
    Ok(())
}