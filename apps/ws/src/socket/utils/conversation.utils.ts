class ConversationManager {
	private activeConversations = new Map<string, Set<string>>();

	addUserToConversation(roomId: string, userId: string) {
		if (!this.activeConversations.has(roomId)) {
			this.activeConversations.set(roomId, new Set());
		}
		this.activeConversations.get(roomId)?.add(userId);
	}

	removeUserFromConversation(roomId: string, userId: string) {
		this.activeConversations.get(roomId)?.delete(userId);
		if (this.activeConversations.get(roomId)?.size === 0) {
			this.activeConversations.delete(roomId);
		}
	}

	getConversationUsers(roomId: string): string[] {
		return Array.from(this.activeConversations.get(roomId) || []);
	}

	isUserInConversation(roomId: string, userId: string): boolean {
		return this.activeConversations.get(roomId)?.has(userId) || false;
	}

	cleanup(userId: string) {
		for (const [roomId, users] of this.activeConversations.entries()) {
			if (users.has(userId)) {
				this.removeUserFromConversation(roomId, userId);
			}
		}
	}
}

export const conversationManager = new ConversationManager();
